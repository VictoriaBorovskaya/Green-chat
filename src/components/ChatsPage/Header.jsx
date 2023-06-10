import { PhoneSVG } from '../SVG';

const Header = ({ setUser, chatId }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bg-[#f0f2f5] flex justify-between items-center h-24 py-5 px-3">
      <div className="flex items-center gap-1">
        <div className="bg-[#00a884] p-2 rounded-full flex items-center justify-center">
          <PhoneSVG />
        </div>
        <p className="text-lg">{chatId}</p>
      </div>
      <span
        className="bg-[#00a884] py-2 px-5 rounded text-white cursor-pointer font-medium"
        onClick={() => {
          window.confirm('Вы действительно хотите выйти?') &&
            setUser({
              idInstance: null,
              apiTokenInstance: null,
            });
        }}>
        Выйти
      </span>
    </div>
  );
};

export default Header;
