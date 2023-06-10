import { useState, useEffect, useCallback, useRef } from 'react';
import cn from 'classnames';
import ChatCreationForm from './ChatCreationForm';
import Header from './Header';
import { MessageSendingSVG } from '../SVG';

const ChatsPage = ({ user, setUser }) => {
  const [enterPhone, setEnterPhone] = useState(false);
  const [chatId, setChatId] = useState();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const messageRef = useRef(null);

  const scrollChat = () => {
    setTimeout(
      () =>
        messageRef.current.scrollTo({
          top: messageRef.current.scrollHeight,
          behavior: 'smooth',
        }),
      0,
    );
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message) {
      try {
        let url = `https://api.green-api.com/waInstance${user.idInstance}/sendMessage/${user.apiTokenInstance}`;
        await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            chatId: `${chatId}@c.us`,
            message: message,
          }),
        });
        setChat([...chat, { type: 'send', text: message }]);
        setMessage('');
        scrollChat();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getMessage = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.green-api.com/waInstance${user.idInstance}/receiveNotification/${user.apiTokenInstance}`,
      );
      const data = await response.json();
      if (
        data.body.senderData &&
        data.body.messageData &&
        data.body.senderData.chatId === `${chatId}@c.us` &&
        data.body.messageData.typeMessage === 'textMessage'
      ) {
        setChat((prev) => [...prev, { type: 'received', text: data.body.messageData.textMessageData.textMessage }]);
        scrollChat();
      }
      await fetch(
        `https://api.green-api.com/waInstance${user.idInstance}/deleteNotification/${user.apiTokenInstance}/${data.receiptId}`,
        {
          method: 'DELETE',
        },
      );
    } catch (error) {
      return error;
    }
  }, [user, chatId]);

  useEffect(() => {
    if (enterPhone) {
      const interval = setInterval(() => getMessage(), 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [getMessage, enterPhone]);

  return (
    <div className="absolute top-0 bottom-0 max-w-screen-md bg-white my-4 mx-auto flex justify-between w-full rounded shadow">
      {!enterPhone && <ChatCreationForm setChatId={setChatId} setEnterPhone={setEnterPhone} />}
      {enterPhone && (
        <form
          className="bg-[url('https://damion.club/uploads/posts/2022-01/1642423515_7-damion-club-p-standartnii-fon-whatsapp-7.png')] w-full h-full bg-cover relative rounded overflow-hidden"
          onSubmit={sendMessage}>
          <div
            ref={messageRef}
            className="absolute top-28 right-0 left-0 bottom-28 flex flex-col gap-5 overflow-y-auto">
            {chat.map((message, index) => {
              return (
                <span
                  className={cn('flex px-5 py-2 w-fit max-w-[70%] sm:max-w-[50%] rounded-t-lg', {
                    'self-end bg-[#c5e6c1] text-end mr-3 rounded-l-lg ': message.type === 'send',
                    'self-start bg-[#e7e8e9] text-start ml-3 rounded-r-lg ': message.type === 'received',
                  })}
                  key={index}>
                  {message.text}
                </span>
              );
            })}
          </div>
          <Header setUser={setUser} chatId={chatId} />
          <div className="absolute bottom-0 left-0 right-0 bg-[#f0f2f5] p-5 flex justify-center h-20 gap-5">
            <input
              className="outline-none px-2 py-1 border border-[#00a884] rounded w-full"
              placeholder="Введите сообщение"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button className="bg-[#00a884] p-2 rounded-full flex items-center justify-center" type="submit">
              <MessageSendingSVG />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChatsPage;
