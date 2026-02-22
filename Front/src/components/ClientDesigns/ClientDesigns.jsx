import PropTypes from 'prop-types';
import styles from './ClientDesigns.module.css';

const ClientDesigns = ({ designs, onDelete }) => {
  if (designs.length === 0) {
    return <p className={styles.noDesigns}>No has subido ningún diseño de inspiración.</p>;
  }

  return (
    <div className={styles.grid}>
      {designs.map((design) => (
        <div key={design._id} className={styles.card}>
          <img src={design.imageUrl} alt="Diseño de inspiración" className={styles.image} />
          <button onClick={() => onDelete(design._id)} className={styles.deleteButton}>×</button>
          {design.createdAt && <div className={styles.dateInfo}><small>{new Date(design.createdAt).toLocaleString()}</small></div>}
        </div>
      ))}
    </div>
  );
};

ClientDesigns.propTypes = {
  designs: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ClientDesigns;