import { Checkbox, Collapse } from 'antd';
import type { PermissionGroup } from '../../../types/role';

interface PermissionSelectorProps {
  groups: PermissionGroup[];
  value?: string[];                    // Form.Item tự truyền vào
  onChange?: (value: string[]) => void; // Form.Item tự truyền vào
}

export default function PermissionSelector({ groups, value = [], onChange }: PermissionSelectorProps) {
  const selected = new Set(value);

  const toggleGroup = (group: PermissionGroup, checked: boolean) => {
    const next = new Set(value);
    group.functions.forEach((f) => (checked ? next.add(f.code) : next.delete(f.code)));
    onChange?.(Array.from(next));
  };

  const toggleFunction = (code: string, checked: boolean) => {
    const next = new Set(value);
    if (checked) next.add(code);
    else next.delete(code);
    onChange?.(Array.from(next));
  };

  return (
    <Collapse
      ghost
      defaultActiveKey={groups.map((g) => g.groupCode)}
      items={groups.map((group) => {
        const count = group.functions.filter((f) => selected.has(f.code)).length;
        const all = count === group.functions.length;
        return {
          key: group.groupCode,
          style: { background: '#FAFAFA', marginBottom: 8, borderRadius: 4 },
          label: <span style={{ color: '#FF7506', fontWeight: 700 }}>{group.groupName}</span>,
          extra: (
            // stopPropagation: bấm checkbox không làm đóng/mở nhóm
            <span onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={all}
                indeterminate={count > 0 && !all}
                onChange={(e) => toggleGroup(group, e.target.checked)}
              />
            </span>
          ),
          children: group.functions.map((f) => (
            <div
              key={f.code}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px', background: '#fff', borderBottom: '1px solid #F0F0F0',
              }}
            >
              <span>{f.name}</span>
              <Checkbox checked={selected.has(f.code)} onChange={(e) => toggleFunction(f.code, e.target.checked)} />
            </div>
          )),
        };
      })}
    />
  );
}