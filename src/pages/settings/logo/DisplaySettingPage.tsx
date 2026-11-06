import { useEffect, useState } from 'react';
import { Button, Form, Input, Upload, message } from 'antd';
import { CheckOutlined, CloseCircleFilled, CloudUploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { settingService } from '../../../api/services/settingService';
import DisplayPreview from '../../../components/logo/DisplayPreview';
import { THEME_COLORS } from '../../../constants/enums';
import { VALIDATION } from '../../../constants/validation';
import type { DisplaySetting } from '../../../types/setting';
import styles from './DisplaySettingPage.module.css';

// Thanh công cụ của ô soạn thảo (theo Figma: đậm, nghiêng, gạch chân, gạch ngang, màu chữ, danh sách, căn lề)
const QUILL_MODULES = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['clean'],
    ],
};

// Ô soạn thảo trống vẫn trả về "<p><br></p>", nên phải bỏ thẻ HTML rồi mới kiểm tra
const hasText = (html?: string) =>
    !!html && html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() !== '';

// Ô chọn màu: Form.Item tự truyền value và onChange vào
interface ColorPaletteProps {
    value?: string;
    onChange?: (color: string) => void;
}

function ColorPalette({ value, onChange }: ColorPaletteProps) {
    return (
        <div className={styles.palette}>
            {THEME_COLORS.map((color) => (
                <button
                    key={color}
                    type="button"
                    aria-label={`Chọn màu ${color}`}
                    className={value === color ? `${styles.swatch} ${styles.swatchActive}` : styles.swatch}
                    style={{ background: color }} // màu lấy từ dữ liệu nên phải để inline
                    onClick={() => onChange?.(color)}
                >
                    {value === color && <CheckOutlined />}
                </button>
            ))}
        </div>
    );
}

type ImageField = 'background' | 'logo';

export default function DisplaySettingPage() {
    const [form] = Form.useForm<DisplaySetting>();
    const [saved, setSaved] = useState<DisplaySetting | null>(null); // giá trị đã lưu, dùng cho nút Hủy bỏ
    const [files, setFiles] = useState<{ background?: File; logo?: File }>({});
    const [submitting, setSubmitting] = useState(false);

    // Giá trị đang nhập, đưa sang khung Demo hiển thị
    const backgroundUrl = Form.useWatch('backgroundUrl', form);
    const logoUrl = Form.useWatch('logoUrl', form);
    const unitName = Form.useWatch('unitName', form);
    const bannerText = Form.useWatch('bannerText', form);
    const themeColor = Form.useWatch('themeColor', form);

    useEffect(() => {
        settingService
            .getDisplaySetting()
            .then((data) => {
                setSaved(data);
                form.setFieldsValue(data);
            })
            .catch((error) => {
                message.error(error instanceof Error ? error.message : 'Không tải được thiết lập hiển thị');
            });
    }, [form]);

    const urlField = (field: ImageField) => (field === 'background' ? 'backgroundUrl' : 'logoUrl');

    // Chọn ảnh: kiểm tra định dạng, dung lượng rồi hiện ảnh xem trước (chưa tải lên server)
    const handlePick = (field: ImageField) => (file: File): false => {
        if (!VALIDATION.IMAGE_TYPES.includes(file.type)) {
            message.error('Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP');
            return false;
        }
        if (file.size > VALIDATION.IMAGE_MAX_MB * 1024 * 1024) {
            message.error(`Ảnh tối đa ${VALIDATION.IMAGE_MAX_MB} MB`);
            return false;
        }
        setFiles((prev) => ({ ...prev, [field]: file }));
        form.setFieldValue(urlField(field), URL.createObjectURL(file));
        return false; // false = không để Ant Design tự tải lên
    };

    const handleRemove = (field: ImageField) => {
        setFiles((prev) => ({ ...prev, [field]: undefined }));
        form.setFieldValue(urlField(field), undefined);
    };

    // Hủy bỏ: trả form về giá trị đã lưu
    const handleCancel = () => {
        form.resetFields();
        if (saved) form.setFieldsValue(saved);
        setFiles({});
    };

    const handleFinish = async (values: DisplaySetting) => {
        setSubmitting(true);
        try {
            // Tải ảnh mới lên lần lượt, rồi mới lưu thiết lập
            const newBackground = files.background
                ? await settingService.uploadImage(files.background)
                : values.backgroundUrl;
            const newLogo = files.logo ? await settingService.uploadImage(files.logo) : values.logoUrl;

            const result = await settingService.saveDisplaySetting({
                ...values,
                backgroundUrl: newBackground,
                logoUrl: newLogo,
            });
            setSaved(result);
            setFiles({});
            form.setFieldsValue(result);
            message.success('Lưu thiết lập hiển thị thành công');
        } catch (error) {
            message.error(error instanceof Error ? error.message : 'Lưu thiết lập thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form<DisplaySetting>
            form={form}
            layout="vertical"
            className={styles.page}
            initialValues={{ themeColor: THEME_COLORS[0] }}
            onFinish={handleFinish}
            // Dấu * đỏ đặt SAU nhãn như Figma
            requiredMark={(label, { required }) => (
                <>
                    {label}
                    {required && <span className={styles.asterisk}> *</span>}
                </>
            )}
        >
            <div className={styles.body}>
                {/* ===== Cột trái: form ===== */}
                <div className={styles.formColumn}>
                    {/* Hai ô ẩn: để form nhớ đường dẫn ảnh (bắt buộc phải có thì Form.useWatch mới đọc được) */}
                    <Form.Item name="backgroundUrl" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="logoUrl" hidden>
                        <Input />
                    </Form.Item>

                    <div className={styles.section}>
                        <div className={styles.fieldLabel}>Hình nền (background)</div>
                        {backgroundUrl ? (
                            <div className={`${styles.thumb} ${styles.bgThumb}`}>
                                <img src={backgroundUrl} alt="Hình nền" />
                                <CloseCircleFilled className={styles.removeIcon} onClick={() => handleRemove('background')} />
                            </div>
                        ) : (
                            <Upload accept=".jpg,.jpeg,.png,.webp" showUploadList={false} beforeUpload={handlePick('background')}>
                                <div className={styles.uploadBox}>
                                    <CloudUploadOutlined className={styles.uploadIcon} />
                                    <span>Chọn file tải lên</span>
                                </div>
                            </Upload>
                        )}
                    </div>

                    <div className={styles.section}>
                        <div className={styles.fieldLabel}>Logo</div>
                        {logoUrl ? (
                            <div className={`${styles.thumb} ${styles.logoThumb}`}>
                                <img src={logoUrl} alt="Logo" />
                                <CloseCircleFilled className={styles.removeIcon} onClick={() => handleRemove('logo')} />
                            </div>
                        ) : (
                            <Upload accept=".jpg,.jpeg,.png,.webp" showUploadList={false} beforeUpload={handlePick('logo')}>
                                <div className={styles.uploadBox}>
                                    <CloudUploadOutlined className={styles.uploadIcon} />
                                    <span>Chọn file tải lên</span>
                                </div>
                            </Upload>
                        )}
                    </div>

                    <Form.Item
                        label="Tên đơn vị"
                        name="unitName"
                        required
                        rules={[
                            {
                                validator: (_, value?: string) =>
                                    hasText(value) ? Promise.resolve() : Promise.reject(new Error('Vui lòng nhập tên đơn vị')),
                            },
                        ]}
                    >
                        <ReactQuill theme="snow" modules={QUILL_MODULES} placeholder="Nhập tên đơn vị" className={styles.editor} />
                    </Form.Item>

                    <Form.Item label="Mã đơn vị" name="unitCode">
                        <Input placeholder="Nhập mã đơn vị" />
                    </Form.Item>

                    <Form.Item label="Biểu ngữ tuyên truyền" name="bannerText">
                        <Input.TextArea placeholder="Nhập mô tả" rows={3} />
                    </Form.Item>

                    <Form.Item label="Tone màu" name="themeColor">
                        <ColorPalette />
                    </Form.Item>
                </div>

                {/* ===== Cột phải: demo hiển thị ===== */}
                <div className={styles.previewColumn}>
                    <div className={styles.previewTitle}>Demo hiển thị</div>
                    <DisplayPreview
                        backgroundUrl={backgroundUrl}
                        logoUrl={logoUrl}
                        unitName={unitName}
                        bannerText={bannerText}
                        themeColor={themeColor}
                    />
                </div>
            </div>

            <div className={styles.footer}>
                <Button className={styles.cancelButton} onClick={handleCancel}>
                    Hủy bỏ
                </Button>
                <Button type="primary" htmlType="submit" className={styles.submitButton} loading={submitting}>
                    Xác nhận
                </Button>
            </div>
        </Form>
    );
}