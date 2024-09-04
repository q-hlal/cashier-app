"use client";
import { useState } from 'react';
import styles from './debit.module.css';

const Page = () => {
  const [addCard, setAddCard] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [price, setPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debitcard, setDebitcard] = useState(JSON.parse(localStorage.getItem('debit')) || []);
  const [addAmount, setAddAmount] = useState('');
  const [getAmount, setGetAmount] = useState('');


  const adminData = JSON.parse(localStorage.getItem('admin')) || { netTotal: 0, totelDebit: 0 };
  const profit = adminData.netTotal ? adminData.netTotal.toLocaleString() : 0;
  const debit = adminData.totelDebit ? adminData.totelDebit.toLocaleString() : 0;

  const handleDebitSave = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const formattedTime = currentDate.toLocaleTimeString();

    const debitEntry = {
      id: Date.now(), 
      name,
      number,
      price,
      date: formattedDate,
      time: formattedTime,
    };

    const existingDebits = JSON.parse(localStorage.getItem('debit')) || [];
    const updatedDebits = [...existingDebits, debitEntry];

    const currentTotalDebit = adminData.totelDebit || 0;
    const updatedTotalDebit = currentTotalDebit + parseFloat(price);
    
    adminData.totelDebit = updatedTotalDebit;
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('debit', JSON.stringify(updatedDebits));

    setDebitcard(updatedDebits);

    setName('');
    setNumber('');
    setPrice('');
    setAddCard(false);
  };

  const handleDelete = (id) => {
    const updatedDebits = debitcard.filter(entry => entry.id !== id);
    localStorage.setItem('debit', JSON.stringify(updatedDebits));
    setDebitcard(updatedDebits);
  };

  const handleEdit = (id) => {
    setEditId(editId === id ? null : id); 
  };

  const filteredDebits = debitcard.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handelDebitAdd = (id, addAmount) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const formattedTime = currentDate.toLocaleTimeString();

    const updatedDebits = debitcard.map(entry => {
      if (entry.id === id) {
        entry.price = (parseFloat(entry.price) + parseFloat(addAmount)).toFixed(2);
        entry.date = formattedDate; // Update the date
        entry.time = formattedTime; // Update the time
      }
      return entry;
    });

    const updatedTotalDebit = updatedDebits.reduce((total, entry) => total + parseFloat(entry.price), 0);
    adminData.totelDebit = updatedTotalDebit;
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('debit', JSON.stringify(updatedDebits));

    setDebitcard(updatedDebits);
    setAddAmount('');
  };

  const handelDebitGet = (id, getAmount) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const formattedTime = currentDate.toLocaleTimeString();

    const updatedDebits = debitcard.map(entry => {
      if (entry.id === id) {
        entry.price = (parseFloat(entry.price) - parseFloat(getAmount)).toFixed(2);
        entry.date = formattedDate; 
        entry.time = formattedTime; 
      }
      return entry;
    });

    const updatedTotalDebit = updatedDebits.reduce((total, entry) => total + parseFloat(entry.price), 0);
    adminData.totelDebit = updatedTotalDebit;

    const updatedNetTotal = adminData.netTotal + parseFloat(getAmount);
    adminData.netTotal = updatedNetTotal;

    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('debit', JSON.stringify(updatedDebits));

    setDebitcard(updatedDebits);
    setGetAmount(''); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.debit}>
        <div className={styles.topAdmin}>
          <h2>اجمالي_النقد: {profit}</h2>
          <h2>اجمالي_الدين: {debit}</h2>
        </div>
        <input 
          placeholder='بحث' 
          className={styles.searchInput} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <div className={styles.bottomAdmin}>
          {filteredDebits.length > 0 ? (
            filteredDebits.map((entry, index) => (
              <div className={styles.debitCard} key={entry.id}>
                <div className={styles.time}>
                  <p>التاريخ : {entry.date}</p>
                  <p>الوقت : {entry.time}</p>
                </div>
                <div className={styles.amount}>
                  <h3 className={parseFloat(entry.price) === 0 ? styles.complet : styles.price}>
                    {parseFloat(entry.price) === 0 ? 'تم استلام المبلغ' : `مبلغ الدين : ${Number(entry.price).toLocaleString()}`}
                  </h3>
                  {editId === entry.id && (
                    <div>
                       <span>
                        <input 
                          placeholder='اضافه دين' 
                          value={addAmount} 
                          onChange={(e) => setAddAmount(e.target.value)} 
                        />
                        <button onClick={() => handelDebitAdd(entry.id, addAmount)}>تاكيد</button>
                      </span>
                      <span>
                        <input 
                          placeholder='استلام دين' 
                          value={getAmount}
                          onChange={(e) => setGetAmount(e.target.value)} 
                        />
                        <button onClick={() => handelDebitGet(entry.id, getAmount)}>تاكيد</button>
                      </span>
                    </div>
                  )}
                </div>
                <div className={styles.info}>
                  <div>
                    <p>رمز العميل : #{index + 1}</p>
                    <p> اسم العميل : {entry.name || "مستطرق"}</p>
                    <p> رقم العميل : {entry.number || "لا يوجد رقم لهذه العميل"}</p>
                  </div>
                  <span>
                    <button onClick={() => handleEdit(entry.id)}>تعديل</button>
                    <button onClick={() => handleDelete(entry.id)}>حذف</button>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.note}>لا يوجد عميل بهذه الاسم </p>
          )}
        </div>
        {addCard && (
          <div className={styles.addCard}>
            <input 
              placeholder='اسم العميل' 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <input 
              placeholder='رقم العميل' 
              value={number} 
              onChange={(e) => setNumber(e.target.value)} 
            />
            <input 
              placeholder='مبلغ الدين' 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
            />
            <button onClick={handleDebitSave}>save</button>
          </div>
        )}
        <div className={styles.add}>
          <button onClick={() => setAddCard(!addCard)}>اضافه</button>
        </div>
      </div>
    </div>
  );
}

export default Page;
