import type { PermissionGroup } from '../../../types/role';

interface PermissionSummaryProps {
  groups: PermissionGroup[];
  permissions: string[];
}

export default function PermissionSummary({ groups, permissions }: PermissionSummaryProps) {
  const selected = new Set(permissions);
  const rows = groups
    .map((group) => ({ group, picked: group.functions.filter((f) => selected.has(f.code)) }))
    .filter((r) => r.picked.length > 0);

  if (rows.length === 0) return <div style={{ color: '#7E7D88' }}>Chưa phân quyền</div>;

  return (
    <>
      {rows.map(({ group, picked }) => (
        <div key={group.groupCode} style={{ marginBottom: 6, lineHeight: 1.5 }}>
          <b>{group.groupName}:</b>{' '}
          {picked.length === group.functions.length ? 'Tất cả' : picked.map((f) => f.name).join(', ')}
        </div>
      ))}
    </>
  );
}