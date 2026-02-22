
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getServices } from '../../services/serviceService';

const AppointmentOption = ({ onLoaded }) => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '' });

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setStatus({ loading: true, error: '' });
        const data = await getServices();
        if (!isMounted) return;

        const list = Array.isArray(data)
          ? data
          : (Array.isArray(data?.data) ? data.data : []);

        setServices(list);
        setStatus({ loading: false, error: '' });
        onLoaded?.(list);
  } catch {
        if (!isMounted) return;
        setStatus({ loading: false, error: 'No se pudieron cargar los servicios' });
        onLoaded?.([]);
      }
    };

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, [onLoaded]);

  if (status.loading) {
    return <option value="" disabled>Cargando servicios…</option>;
  }

  if (status.error) {
    return <option value="" disabled>{status.error}</option>;
  }

  if (!services.length) {
    return <option value="" disabled>No hay servicios disponibles</option>;
  }

  return (
    <>
      <option value="" disabled hidden>Selecciona un servicio</option>
      {services.map((svc) => (
        <option key={svc._id || svc.name} value={svc.name}>
          {svc.name}
        </option>
      ))}
    </>
  );
};

AppointmentOption.propTypes = {
  onLoaded: PropTypes.func,
};

export default AppointmentOption;