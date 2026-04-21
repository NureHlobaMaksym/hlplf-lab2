import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../shared/constants/routes';

export const NotFoundPage = () => {
  return (
    <div className="panel">
      <h2>Сторінку не знайдено</h2>
      <p>Перевірте адресу або поверніться до постів.</p>
      <Link className="link-btn" to={APP_ROUTES.POSTS}>
        До постів
      </Link>
    </div>
  );
};
