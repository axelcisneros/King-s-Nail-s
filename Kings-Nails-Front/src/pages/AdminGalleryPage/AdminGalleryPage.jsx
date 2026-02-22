import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import AdminGalleryGrid from '../../components/AdminGalleryGrid/AdminGalleryGrid';
import headerStyles from '../../components/Header/Header.module.css';
import AdminGalleryUpload from '../../components/AdminGalleryUpload/AdminGalleryUpload';
import styles from './AdminGalleryPage.module.css';
import Modal from '../../components/Modal/Modal';
import { toast } from 'react-toastify';
import { useConfirm } from '../../hooks/useConfirm';

const AdminGalleryPage = () => {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [viewingUserDesigns, setViewingUserDesigns] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = viewingUserDesigns ? await adminService.getAllUserDesigns() : await adminService.getGalleryImages();
        setImages(data);
      } catch (err) {
        setError('No se pudieron cargar las imágenes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [viewingUserDesigns]);

  const handleUpload = async (formData) => {
    try {
      setUploading(true);
      const newImage = await adminService.addGalleryImage(formData);
      setImages((prev) => [newImage, ...prev]);
      toast.success('Imagen subida con éxito');
    } catch (err) {
        toast.error(`Error al subir: ${err}`);
    } finally {
      setUploading(false);
    }
  };

  const confirm = useConfirm();

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Confirmar eliminación', message: 'Estás segura de que quieres eliminar esta imagen?', confirmText: 'Sí, eliminar', cancelText: 'Cancelar' });
    if (!ok) return;
    try {
      if (viewingUserDesigns) await adminService.deleteUserDesign(id);
      else await adminService.deleteGalleryImage(id);
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast.success('Imagen eliminada');
    } catch (err) {
      toast.error(`Error al eliminar: ${err}`);
    }
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);


  const openPreview = (img) => {
    setPreviewImage(img);
    setPreviewOpen(true);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestionar Galería Oficial</h1>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexDirection: 'column', marginBottom: '1rem' }}>
        <AdminGalleryUpload onUpload={handleUpload} loading={uploading} />
        <div style={{display: 'flex', justifyContent: 'space-between', width: '40%'}}>
          <button type="button" onClick={() => setViewingUserDesigns(false)} disabled={!viewingUserDesigns} className={headerStyles.logoutButton}>Galería oficial</button>
          <button type="button" onClick={() => setViewingUserDesigns(true)} disabled={viewingUserDesigns} className={headerStyles.logoutButton}>Diseños de usuarios</button>
        </div>
      </div>
      {loading && <p>Cargando galería...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <>
          {viewingUserDesigns && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', alignItems: 'center' }}>
              <input placeholder="Filtrar por nombre o email" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} />
              <div style={{ marginLeft: 'auto' }}>
                <small>Mostrando {images.length} diseños</small>
              </div>
            </div>
          )}
          <AdminGalleryGrid images={images.filter(img => {
            if (!filter) return true;
            const txt = filter.toLowerCase();
            const name = img.user?.name?.toLowerCase() || '';
            const email = img.user?.email?.toLowerCase() || '';
            return name.includes(txt) || email.includes(txt);
          }).slice((page-1)*pageSize, page*pageSize)} onDelete={handleDelete} onPreview={openPreview} />

          {/* Pagination controls */}
          {viewingUserDesigns && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Anterior</button>
              <span>Página {page}</span>
              <button onClick={() => setPage(p => p+1)} disabled={(page*pageSize) >= images.filter(img => {
                if (!filter) return true;
                const txt = filter.toLowerCase();
                const name = img.user?.name?.toLowerCase() || '';
                const email = img.user?.email?.toLowerCase() || '';
                return name.includes(txt) || email.includes(txt);
              }).length}>Siguiente</button>
            </div>
          )}
        </>
      )}

      {/* Confirmations handled by ConfirmProvider */}

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)}>
        {previewImage && (
          <div style={{ textAlign: 'center' }}>
            <img src={previewImage.url || previewImage.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70vh' }} />
            {previewImage.user && <p style={{ marginTop: '0.5rem' }}><strong>{previewImage.user.name}</strong> {previewImage.user.email && `(${previewImage.user.email})`}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminGalleryPage;