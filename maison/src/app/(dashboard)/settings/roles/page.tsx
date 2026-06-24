"use client";

import { useEffect, useState } from "react";
import { getRoles, createRole, updateRole, deleteRole, type RoleItem } from "@/lib/api";

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formDescription, setFormDescription] = useState("");

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Failed to load roles:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingRole(null);
    setFormName("");
    setFormLabel("");
    setFormDescription("");
    setShowModal(true);
  }

  function openEditModal(role: RoleItem) {
    setEditingRole(role);
    setFormName(role.name);
    setFormLabel(role.label);
    setFormDescription(role.description ?? "");
    setShowModal(true);
  }

  async function handleSave() {
    if (!formName.trim() || !formLabel.trim()) return;
    try {
      if (editingRole) {
        await updateRole(editingRole.id, {
          label: formLabel,
          description: formDescription || undefined,
        });
      } else {
        await createRole({
          name: formName,
          label: formLabel,
          description: formDescription || undefined,
        });
      }
      setShowModal(false);
      loadRoles();
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  }

  async function handleDeleteRole(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa vai trò này?")) return;
    try {
      await deleteRole(id);
      loadRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-sm text-secondary">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Quản lý vai trò</h1>
          <p className="mt-1 text-sm text-secondary">Quản lý quyền truy cập của người dùng</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Tạo vai trò mới
        </button>
      </div>

      <div className="rounded-lg border border-border bg-surface">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-medium text-secondary">Tên vai trò</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-secondary">Nhãn</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-secondary">Mô tả</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-secondary">Trạng thái</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-secondary">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b border-border last:border-b-0">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-text">{role.name}</span>
                  {role.isSystem && (
                    <span className="ml-2 rounded bg-border px-1.5 py-0.5 text-xs text-secondary">Hệ thống</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-text">{role.label}</td>
                <td className="px-6 py-4 text-sm text-secondary">{role.description ?? "—"}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block h-2 w-2 rounded-full ${role.isActive ? "bg-success" : "bg-border"}`} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => openEditModal(role)}
                      className="text-sm text-primary hover:underline"
                    >
                      Sửa
                    </button>
                    {!role.isSystem && (
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-sm text-error hover:underline"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-secondary">
                  Chưa có vai trò nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-surface p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-text">
              {editingRole ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}
            </h2>
            <p className="mt-1 text-sm text-secondary">
              {editingRole ? "Cập nhật thông tin vai trò" : "Thêm vai trò mới"}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text">Tên vai trò</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  disabled={!!editingRole}
                  className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm text-text outline-none focus:border-primary disabled:opacity-50"
                  placeholder="Ví dụ: project_manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">Nhãn hiển thị</label>
                <input
                  type="text"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm text-text outline-none focus:border-primary"
                  placeholder="Ví dụ: Project Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">Mô tả</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full resize-none rounded-lg border border-border px-3 py-2 text-sm text-text outline-none focus:border-primary"
                  placeholder="Mô tả ngắn về vai trò này"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-border/50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={!formName.trim() || !formLabel.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                {editingRole ? "Lưu" : "Tạo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}