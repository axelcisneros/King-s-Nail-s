import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  return (
    <div className={styles.layout} data-gradient-text>
      <AdminSidebar />
      <main className={styles.content} data-gradient-text>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;