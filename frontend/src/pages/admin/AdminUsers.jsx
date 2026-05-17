import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { getUsers, updateUser, deleteUser } from '../../services/adminService';

function AdminUsersContent() {
  const [users, setUsers] = useState([]);

  const load = () => getUsers().then((r) => setUsers(r.data.data));
  useEffect(() => { load(); }, []);

  const changeRole = async (id, role) => {
    const u = users.find((x) => x.id === id);
    await updateUser(id, { nama: u.nama, role });
    await load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus user?')) return;
    try {
      await deleteUser(id);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Kelola User</h1>
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="px-4 py-3">{u.nama}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => handleDelete(u.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default function AdminUsers() {
  return <ProtectedRoute adminOnly><AdminUsersContent /></ProtectedRoute>;
}
