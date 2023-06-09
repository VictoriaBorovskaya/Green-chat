import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      <p>Страница не найдена</p>
      <Link to="/">Вернуться на страницу авторизации</Link>
    </div>
  );
};

export default NotFoundPage;
