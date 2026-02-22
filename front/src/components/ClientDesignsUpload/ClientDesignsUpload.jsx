import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import userDesignService from '../../services/clientDesignService';
import styles from './ClientDesignsUpload.module.css';
import useFormValidation from '../../hooks/useFormValidation';

const ClientDesignsUpload = ({ onUploadSuccess }) => {
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { formData, handleChange, reset } = useFormValidation({ image: null });

  const file = formData.image;

  useEffect(() => {
    let url;
    if (file) {
      url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview('');
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecciona un archivo de imagen.');
      return;
    }

    setError('');
    setLoading(true);

    const payload = new FormData();
    payload.append('image', file);

    try {
      await userDesignService.uploadDesign(payload);
      onUploadSuccess(); // Notifica al componente padre para que refresque la lista
      reset({ image: null });
      setPreview('');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="file"
        id="imageUpload"
        name="image"
        onChange={handleChange}
        accept="image/*"
        className={styles.fileInput}
        aria-label="Seleccionar archivo de imagen"
        aria-describedby="file-help"
      />
      <label htmlFor="imageUpload" className={styles.fileLabel}>Seleccionar Imagen</label>
      <p id="file-help" className={styles.helpText}>Formatos permitidos: JPG, PNG. Tamaño máximo: 5MB</p>
      {preview && <img src={preview} alt="Vista previa" className={styles.preview} />}
      <button type="submit" disabled={!file || loading} className={styles.uploadButton}>
        {loading ? 'Subiendo...' : 'Subir Diseño'}
      </button>
    </form>
  );
};

ClientDesignsUpload.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default ClientDesignsUpload;