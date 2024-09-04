"use client";
import { useState, useEffect } from 'react';
import styles from './debit.module.css';

const Page = () => {
  const [addCard, setAddCard] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [price, setPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debitcard, setDebitcard] = useState([]);
  const [addAmount, setAddAmount] = useState('');
  const [getAmount, setGetAmount] = useState('');
  const [adminData, setAdminData] = useState({ netTotal: 0, totelDebit: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDebit = JSON.parse(localStorage.getItem('debit')) || [];
      setDebitcard(storedDebit);

      const storedAdminData = JSON.parse(localStorage.getItem('admin')) || { netTotal: 0, totelDebit: 0 };
      setAdminData(storedAdminData);
    }
  }, []);

  const handleDebitSave = () => {
    if (!name || !number || !price || isNaN(price)) {
      alert("Please enter valid data.");
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const formattedTime = currentDate.toLocaleTimeString();

    const debitEntry = {
      id: Date.now(), 
      name,
      number,
      price: parseFloat(price).toFixed(2),
      date: formattedDate,
      time: formattedTime,
    };

    const updatedDebits = [...debitcard, debitEntry];
    const updatedTotalDebit = (adminData.totelDebit || 0) + parseFloat(price);
    const updatedAdminData = { ...adminData, totelDebit: updatedTotalDebit };

    if (typeof window !== 'undefined') {
      localStorage.setItem('admin', JSON.stringify(updatedAdminData));
      localStorage.setItem('debit', JSON.stringify(updatedDebits));
    }

    setDebitcard(updatedDebits);
    setAdminData(updatedAdminData);

    setName('');
    setNumber('');
    setPrice('');
    setAddCard(false);
  };

  const handleDelete = (id) => {
    const updatedDebits = debitcard.filter(entry => entry.id !== id);
    const deletedEntry = debitcard.find(entry => entry.id === id);

    if (deletedEntry) {
      const updatedTotalDebit = updatedDebits.reduce((total, entry) => total + parseFloat(entry.price), 0);
      const updatedAdminData = { ...adminData, totelDebit: updatedTotalDebit };

      if (typeof window !== 'undefined') {
        localStorage.setItem('admin', JSON.stringify(updatedAdminData));
        localStorage.setItem('debit', JSON.stringify(updatedDebits));
      }

      setDebitcard(updatedDebits);
      setAdminData(updatedAdminData);
    }
  };

  const handleEdit = (id) => {
    setEditId(editId === id ? null : id); 
  };

  const handleDebitAdd = (id, addAmount) => {
    if (isNaN(addAmount) || addAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const updatedDebits = debitcard.map(entry => {
      if (entry.id === id) {
        entry.price = (parseFloat(entry.price) + parseFloat(addAmount)).toFixed(2);
        entry.date = new Date().toLocaleDateString();
        entry.time = new Date().toLocaleTimeString();
      }
      return entry;
    });

    const updatedTotalDebit = updatedDebits.reduce((total, entry) => total + parseFloat(entry.price), 0);
    const updatedAdminData = { ...adminData, totelDebit: updatedTotalDebit };

    if (typeof window !== 'undefined') {
      localStorage.setItem('admin', JSON.stringify(updatedAdminData));
      localStorage.setItem('debit', JSON.stringify(updatedDebits));
    }

    setDebitcard(updatedDebits);
    setAdminData(updatedAdminData);
    setAddAmount('');
  };

  const handleDebitGet = (id, getAmount) => {
    if (isNaN(getAmount) || getAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const updatedDebits = debitcard.map(entry => {
      if (entry.id === id) {
        entry.price = (parseFloat(entry.price) - parseFloat(getAmount)).toFixed(2);
        entry.date = new Date().toLocaleDateString();
        entry.time = new Date().toLocaleTimeString();
      }
      return entry;
    });

    const updatedTotalDebit = updatedDebits.reduce((total, entry) => total + parseFloat(entry.price), 0);
    const updatedNetTotal = adminData.netTotal + parseFloat(getAmount);
    const updatedAdminData = { ...adminData, totelDebit: updatedTotalDebit, netTotal: updatedNetTotal };

    if (typeof window !== 'undefined') {
      localStorage.setItem('admin', JSON.stringify(updatedAdminData));
      localStorage.setItem('debit', JSON.stringify(updatedDebits));
    }

    setDebitcard(updatedDebits);
    setAdminData(updatedAdminData);
    setGetAmount('');
  };

  const filteredDebits = debitcard.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.debit}>
        <div className={styles.topAdmin}>
          <h2>اجمالي_النقد: {adminData.netTotal.toLocaleString()}</h2>
          <h2>اجمالي_الدين: {adminData.totelDebit.toLocaleString()}</h2>
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
                        <button onClick={() => handleDebitAdd(entry.id, addAmount)}>تاكيد</button>
                      </span>
                      <span>
                        <input 
                          placeholder='استلام دين' 
                          value={getAmount}
                          onChange={(e) => setGetAmount(e.target.value)} 
                        />
                        <button onClick={() => handleDebitGet(entry.id, getAmount)}>تاكيد</button>
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
