import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import HeaderUser from '../common/HeaderUser';
import logo from '../../assets/images/Logo.png';
import styles from './CounterHeader.module.css';

export default function CounterHeader({ title }: { title: string }) {
    const navigate = useNavigate();

    return (
        <div className={styles.header}>
            <div className={styles.left}>
                <ArrowLeftOutlined className={styles.back} onClick={() => navigate(-1)} />
                <img src={logo} alt="QMS" className={styles.logo} />
            </div>

            <div className={styles.title}>{title}</div>

            <div className={styles.right}>
                <HeaderUser />
            </div>
        </div>
    );
}