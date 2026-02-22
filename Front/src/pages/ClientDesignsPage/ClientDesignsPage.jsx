import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './ClientDesignsPage.module.css';
import clientDesignService from '../../services/clientDesignService';
import ClientDesigns from '../../components/ClientDesigns/ClientDesigns';
import ClientDesignUpload from '../../components/ClientDesignsUpload/ClientDesignsUpload';
import ConfirmToast from '../../components/ConfirmToast/ConfirmToast';

const ClientDesignsPage = () => {
  const [designs, setDesigns] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);
  const [errorDesigns, setErrorDesigns] = useState('');

  // --- Lógica de Diseños de Inspiración ---
  const fetchDesigns = async () => {
    try {
      setLoadingDesigns(true);
      const data = await clientDesignService.getMyDesigns();
      setDesigns(data);
    } catch {
      setErrorDesigns('No se pudieron cargar tus diseños.');
    } finally {
      setLoadingDesigns(false);
    }
  };

  const handleDeleteDesign = async (id) => {
    const onConfirm = async () => {
      try {
        await clientDesignService.deleteMyDesign(id);
        toast.success('Diseño eliminado correctamente.');
        fetchDesigns(); // Refrescar la lista
      } catch (err) {
        toast.error(err.toString());
      }
    };

    toast(<ConfirmToast onConfirm={onConfirm} message="Estás segura de que quieres eliminar este diseño?" />, {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      position: 'top-center',
    });
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mis Diseños</h2>
        <ClientDesignUpload onUploadSuccess={fetchDesigns} />
        {loadingDesigns && <p>Cargando diseños...</p>}
        {errorDesigns && <p className={styles.error}>{errorDesigns}</p>}
        {!loadingDesigns && !errorDesigns && <ClientDesigns designs={designs} onDelete={handleDeleteDesign} />}
      </div>
  );
};

export default ClientDesignsPage;