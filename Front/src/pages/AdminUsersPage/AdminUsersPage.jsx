import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import styles from './AdminUsersPage.module.css';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/Modal/Modal';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetAction, setTargetAction] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (err) {
        setError('No se pudieron cargar los usuarios.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const { user: currentUser } = useAuth();

  // Detectar quién es el super admin entre los usuarios listados (el admin con createdAt más antiguo)
  const findSuperAdminId = () => {
    const admins = users.filter((u) => u.role === 'admin');
    if (admins.length === 0) return null;
    admins.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return admins[0]._id;
  };

  const handleChangeRole = async (targetUserId, newRole) => {
    try {
      await adminService.setUserRole(targetUserId, newRole);
      // Refrescar lista localmente
      setUsers((prev) => prev.map((u) => (u._id === targetUserId ? { ...u, role: newRole } : u)));
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar el rol.');
    }
  };

  const openConfirm = (userId, newRole, userName) => {
    setTargetAction({ userId, newRole, userName });
    setConfirmOpen(true);
  };

  const confirmAction = async () => {
    if (!targetAction) return;
    await handleChangeRole(targetAction.userId, targetAction.newRole);
    setConfirmOpen(false);
    setTargetAction(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestionar Usuarios</h1>
      {loading && <p>Cargando usuarios...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const superAdminId = findSuperAdminId();
              const isSuperAdmin = currentUser && currentUser._id === superAdminId;
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {isSuperAdmin && currentUser._id !== user._id && (
                      <>
                        {user.role !== 'admin' ? (
                          <button className={styles.promoteButton} onClick={() => openConfirm(user._id, 'admin', user.name)}>Promover a Admin</button>
                        ) : (
                          <button className={styles.downgradeButton} onClick={() => openConfirm(user._id, 'client', user.name)}>Degradar a Cliente</button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <h2>Confirmar acción</h2>
        <p>
          {'\u00BFEst\u00E1s seguro que deseas '}{targetAction?.newRole === 'admin' ? 'promover' : 'degradar'}{' a '}<strong>{targetAction?.userName}</strong>?
        </p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
          <button className={styles.promoteButton} onClick={confirmAction}>Sí, confirmar</button>
          <button className={styles.downgradeButton} onClick={() => setConfirmOpen(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;