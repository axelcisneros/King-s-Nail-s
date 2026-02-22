import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AdminGalleryUpload.module.css';
import useFormValidation from '../../hooks/useFormValidation';
import { toast } from 'react-toastify';
import { getServices } from '../../services/serviceService';

const AdminGalleryUpload = ({ onUpload, loading }) => {
  const [dummy, setDummy] = useState(0); // used to force reset if needed
  const [services, setServices] = useState([]);
  const [servicesStatus, setServicesStatus] = useState({ loading: true, error: '' });

  const { formData, handleChange, reset } = useFormValidation({ image: null, serviceId: '' });
  const file = formData.image;
  const serviceId = formData.serviceId;

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setServicesStatus({ loading: true, error: '' });
        const data = await getServices();
        if (!isMounted) return;
        setServices(Array.isArray(data) ? data : []);
        setServicesStatus({ loading: false, error: '' });
      } catch (error) {
        if (!isMounted) return;
        const message = typeof error === 'string' ? error : 'No se pudieron cargar los servicios disponibles.';
        setServicesStatus({ loading: false, error: message });
      }
    };

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning('Por favor, selecciona un archivo para subir.');
      return;
    }
    if (servicesStatus.loading) {
      toast.info('Espera a que se carguen los servicios.');
      return;
    }
    if (!serviceId) {
      toast.warning('Selecciona el servicio al que pertenece la imagen.');
      return;
    }

    const selectedService = services.find((svc) => String(svc._id) === String(serviceId));

    if (!selectedService) {
      toast.error('El servicio seleccionado ya no está disponible.');
      return;
    }

    const fd = new FormData();
    fd.append('image', file);
    fd.append('title', selectedService.name || 'Servicio');
    if (selectedService.description) {
      fd.append('description', selectedService.description);
    }
    onUpload(fd);
    reset({ image: null, serviceId: '' });
    setDummy((d) => d + 1);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <h2 className={styles.title}>Subir Nueva Imagen</h2>
      <div className={styles.fieldGroup}>
        <label htmlFor="serviceId">Servicio asociado</label>
        <select
          id="serviceId"
          name="serviceId"
          value={serviceId || ''}
          onChange={handleChange}
          disabled={servicesStatus.loading || services.length === 0}
          required
          className={styles.select}
          aria-describedby="service-help"
          aria-label="Seleccionar servicio asociado"
        >
          <option value="" disabled hidden>
            Selecciona un servicio
          </option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>
        <p id="service-help" className={styles.hint}>Elige el servicio al que pertenecerá esta imagen</p>
        {servicesStatus.loading && <p className={styles.hint}>Cargando servicios...</p>}
        {servicesStatus.error && <p className={styles.error}>{servicesStatus.error}</p>}
        {!servicesStatus.loading && !servicesStatus.error && services.length === 0 && (
          <p className={styles.error}>Aún no hay servicios registrados. Crea uno antes de subir imágenes.</p>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="image">Archivo de imagen</label>
        <div className={styles.fileRow}>
          <input
            key={dummy}
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
            aria-label="Seleccionar archivo de imagen"
            aria-describedby="image-help"
          />
          <button type="submit" disabled={loading || !file || !serviceId || servicesStatus.loading}>
            {loading ? 'Subiendo...' : 'Subir'}
          </button>
        </div>
        <p id="image-help" className={styles.hint}>Formato recomendado: JPG o PNG. Tamaño máximo 5MB.</p>
      </div>
    </form>
  );
};

AdminGalleryUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default AdminGalleryUpload;