import { Outlet } from 'react-router-dom';
import ClientSidebar from '../ClientSidebar/ClientSidebar';
import styles from './ClientLayout.module.css';

const ClientLayout = () => {
  return (
    <div className={styles.layout} data-gradient-text>
      <ClientSidebar />
      <main className={styles.content} data-gradient-text>
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;