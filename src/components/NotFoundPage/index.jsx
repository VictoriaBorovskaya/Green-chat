import { BackSVG } from 'components/SVG';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="max-w-screen-md m-auto w-full">
      <p className="text-center text-xl ">Страница не найдена</p>
      <Link to="/">
        <button className="border-none bg-white px-5 py-3 text-lg rounded cursor-pointer flex items-center justify-center gap-2 w-full sm:w-3/5 md:w-1/2 mx-auto my-2">
          <BackSVG />
          Вернуться на страницу авторизации
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
