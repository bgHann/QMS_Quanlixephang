import styles from "./DeviceTemplateSelector.module.css";

interface DeviceTemplate {
  id: string;
  name: string;
  preview: string;
}

interface DeviceTemplateSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  mode?: "buttons" | "preview" | "all";
}

const templates: DeviceTemplate[] = [
  {
    id: "TEMPLATE_01",
    name: "Giao diện 1",
    preview: "/images/templates/template-01.png",
  },
  {
    id: "TEMPLATE_02",
    name: "Giao diện 2",
    preview: "/images/templates/template-02.png",
  },
  {
    id: "TEMPLATE_03",
    name: "Giao diện 3",
    preview: "/images/templates/template-03.png",
  },
  {
    id: "TEMPLATE_04",
    name: "Giao diện 4",
    preview: "/images/templates/template-04.png",
  },
];

export default function DeviceTemplateSelector({
  value,
  onChange,
  mode = "all",
}: DeviceTemplateSelectorProps) {
  const selectedTemplate = templates.find((template) => template.id === value);

  return (
    <div className={styles.container}>
      {(mode === "buttons" || mode === "all") && (
        <div className={styles.templateList}>
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              className={`${styles.templateButton} ${
                value === template.id ? styles.selected : ""
              }`}
              onClick={() => onChange?.(template.id)}
            >
              {template.name}
            </button>
          ))}
        </div>
      )}

      {(mode === "preview" || mode === "all") && (
        <div className={styles.preview}>
          <span className={styles.previewTitle}>Xem trước</span>

          <div className={styles.previewContent}>
            {selectedTemplate ? (
              <img
                src={selectedTemplate.preview}
                alt={`Xem trước ${selectedTemplate.name}`}
                className={styles.previewImage}
              />
            ) : (
              <span className={styles.placeholder}>
                Chọn một giao diện để xem trước
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
