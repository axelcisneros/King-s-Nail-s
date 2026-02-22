import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { getServices, clearServicesCache } from '../../services/serviceService';
import styles from './AdminServicesPage.module.css';
import { isPositiveNumber } from '../../utils/validators';
import useFormValidation from '../../hooks/useFormValidation';
import { useConfirm } from '../../hooks/useConfirm';
import { toast } from 'react-toastify';
import { showUndoToast } from '../../utils/undoToast.jsx';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);


  // Helpers: formatting/parsing
  const formatToMXN = (v) => {
    const n = Number(v);
    if (isNaN(n)) return '';
    return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  };

  const parseMXNToNumber = (str) => {
    if (typeof str === 'number') return str;
    if (!str) return NaN;
    // remove everything except digits and dot/comma
    const cleaned = String(str).replace(/[^0-9.,-]/g, '').replace(/,/g, '');
    const n = Number(cleaned);
    return isNaN(n) ? NaN : n;
  };

  const minutesToHHMMSS = (mins) => {
    const m = Number(mins);
    if (isNaN(m) || m < 0) return '';
    const totalSeconds = Math.round(m * 60);
    const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const ss = String(totalSeconds % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const hhmmssToMinutes = (str) => {
    if (!str || typeof str !== 'string') return NaN;
    const parts = str.split(':').map(p => Number(p));
    if (parts.some(p => isNaN(p) || p < 0)) return NaN;
    let secs = 0;
    if (parts.length === 3) secs = parts[0] * 3600 + parts[1] * 60 + parts[2];
    else if (parts.length === 2) secs = parts[0] * 60 + parts[1];
    else secs = parts[0];
    return secs / 60;
  };

  const validate = (fieldName, value) => {
    if (fieldName === 'name' || fieldName === 'description') {
      return value && value.toString().trim() ? '' : `${fieldName === 'name' ? 'Nombre' : 'Descripción'} requerido`;
    }
    if (fieldName === 'price') {
      // accept numeric or formatted MXN string
      const n = parseMXNToNumber(value);
      return isPositiveNumber(n) ? '' : 'Precio debe ser un número positivo';
    }
    if (fieldName === 'duration') {
      // accept minutes number or hh:mm[:ss]
      let minutes = Number(value);
      if (isNaN(minutes)) minutes = hhmmssToMinutes(String(value));
      return isPositiveNumber(minutes) ? '' : 'Duración debe ser un número positivo (minutos) o formato hh:mm:ss';
    }
    return '';
  };

  const { formData: currentService, setFormData: setCurrentService, handleChange, validateAll, fieldErrors: vfErrors } = useFormValidation({ name: '', description: '', price: '', duration: '' }, validate);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError('No se pudieron cargar los servicios.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // handleChange provided by hook

  const handleEdit = (service) => {
    setIsEditing(true);
    // format price and duration for the form
    setCurrentService({
      ...service,
      price: service.price != null ? formatToMXN(service.price) : '',
      duration: service.duration != null ? minutesToHHMMSS(service.duration) : '',
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentService({ name: '', description: '', price: '', duration: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ok = await validateAll();
      if (!ok) return;

      // prepare payload: parse price and duration into numbers expected by backend
      const payload = { ...currentService };
      payload.price = parseMXNToNumber(currentService.price);
      // duration expected in minutes as Number
      let dur = Number(currentService.duration);
      if (isNaN(dur)) dur = hhmmssToMinutes(String(currentService.duration));
      payload.duration = Math.round(dur);

      if (isEditing) {
        const updatedService = await adminService.updateService(currentService._id, payload);
        setServices(services.map(s => s._id === currentService._id ? updatedService : s));
        clearServicesCache(); // Clear cache after admin updates
        toast.success('Servicio actualizado');
      } else {
        const newService = await adminService.addService(payload);
        setServices([...services, newService]);
        clearServicesCache(); // Clear cache after admin creates
        toast.success('Servicio creado');
      }
      handleCancelEdit();
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  const confirm = useConfirm();

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Confirmar eliminación', message: 'Estás segura de que quieres eliminar este servicio?', confirmText: 'Sí, eliminar', cancelText: 'Cancelar' });
    if (!ok) return;
    // optimistic remove + offer undo
    const toRemove = services.find(s => s._id === id);
    setServices((prev) => prev.filter((s) => s._id !== id));
    try {
      await adminService.deleteService(id);
      clearServicesCache(); // Clear cache after admin deletes
      // show undo toast which will try to recreate the service if user clicks Deshacer
      showUndoToast('Servicio eliminado', async () => {
        if (!toRemove) return;
        const recreated = await adminService.addService({ name: toRemove.name, description: toRemove.description, price: toRemove.price, duration: toRemove.duration });
        setServices((prev) => [recreated, ...prev]);
        clearServicesCache(); // Clear cache after undo recreation
      });
    } catch (err) {
      // rollback locally if delete failed
      setServices((prev) => [toRemove, ...prev]);
      toast.error(`Error al eliminar: ${err}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestionar Servicios</h1>

  <form onSubmit={handleSubmit} noValidate className={styles.form}>
  <h2>{isEditing ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}</h2>
  <input name="name" value={currentService.name} onChange={handleChange} placeholder="Nombre del servicio" required />
  {vfErrors.name && <p className={styles.error}>{vfErrors.name}</p>}
  <input name="description" value={currentService.description} onChange={handleChange} placeholder="Descripción breve" required />
  {vfErrors.description && <p className={styles.error}>{vfErrors.description}</p>}
  <input name="price" type="text" value={currentService.price} onChange={handleChange} placeholder="Precio (ej: $250.00)" onBlur={(e) => {
        // format display on blur
        const v = e.target.value;
        const n = parseMXNToNumber(v);
        if (!isNaN(n)) setCurrentService((prev) => ({ ...prev, price: formatToMXN(n) }));
      }} required />
  {vfErrors.price && <p className={styles.error}>{vfErrors.price}</p>}
  <input name="duration" type="text" value={currentService.duration} onChange={handleChange} placeholder="Duración (hh:mm:ss o minutos)" onBlur={(e) => {
        const v = e.target.value;
        const n = Number(v);
        if (!isNaN(n)) {
          // numeric minutes entered -> format to hh:mm:ss
          setCurrentService((prev) => ({ ...prev, duration: minutesToHHMMSS(n) }));
        } else {
          const mins = hhmmssToMinutes(String(v));
          if (!isNaN(mins)) setCurrentService((prev) => ({ ...prev, duration: minutesToHHMMSS(mins) }));
        }
      }} required />
  {vfErrors.duration && <p className={styles.error}>{vfErrors.duration}</p>}
        <div className={styles.formActions}>
          <button type="submit">{isEditing ? 'Guardar Cambios' : 'Añadir Servicio'}</button>
          {isEditing && <button type="button" onClick={handleCancelEdit}>Cancelar</button>}
        </div>
      </form>

      <div className={styles.list}>
        <h2>Lista de Servicios</h2>
        {loading && <p>Cargando...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {services.map(service => (
          <div key={service._id} className={styles.serviceItem}>
            <div>
              <strong>{service.name}</strong> (${service.price}) - {service.duration} min
              <p>{service.description}</p>
            </div>
            <div className={styles.itemActions}>
              <button onClick={() => handleEdit(service)}>Editar</button>
              <button onClick={() => handleDelete(service._id)} className={styles.deleteButton}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      {/* confirmations handled by ConfirmProvider */}
    </div>
  );
};

export default AdminServicesPage;