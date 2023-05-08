import React from "react";

function Contacts() {
  return (
    <section>
      <div className="cont contact_block">
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa2babddd7209b930bf232ba9582f6d0e4a1b89b2a308c33aaa2251b3c1b98e15&amp;source=constructor"
          frameborder="0"
        ></iframe>
        <div className="contact_info">
          <p>Адрес: Россия, г. Рязань, ул. СУСанина, д. 9, этаж 9</p>
          <p>Режим работы: Понедельник-Пятница с 09-00 до 21-00</p>
          <p>Выходной: Суббота, воскресенье</p>
          <p>
            Телефон: <a href="tel:+7 (999) 999-99-99">+7 (999) 999-99-99</a>
          </p>
          <p>
            E-mail: <a href="mailto:suspenzia@bk.ru">suspenzia@bk.ru</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Contacts;
