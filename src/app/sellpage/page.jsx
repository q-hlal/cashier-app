"use client";
import styles from './sell.module.css';
import { FaCartShopping, FaQrcode } from "react-icons/fa6";
import { BiSolidDiscount } from "react-icons/bi";
import { MdOutlinePriceChange, MdDeleteForever } from "react-icons/md";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useState, useEffect } from 'react';

const SellPage = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [notification, setNotification] = useState(false);

  const [scannerValue, setScannerValue] = useState(() => {
    const savedValues = localStorage.getItem('scannerValue');
    return savedValues ? JSON.parse(savedValues) : [];
  });

  useEffect(() => {
    localStorage.setItem('scannerValue', JSON.stringify(scannerValue));
  }, [scannerValue]);

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scanner.render(
        (result) => {
          try {
            const parsedResult = JSON.parse(result);
            setScannerValue(prevValues => {
              const existingItem = prevValues.find(item => item.itemName === parsedResult.itemName);
              if (existingItem) {
                return prevValues.map(item =>
                  item.itemName === parsedResult.itemName
                    ? { ...item, quantity: item.quantity + 1, price: item.price + parsedResult.price }
                    : item
                );
              } else {
                return [...prevValues, { ...parsedResult, quantity: 1 }];
              }
            });
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
          scanner.clear();
          setShowScanner(false);
        },
        (err) => {
          console.error("Scanner error:", err);
        }
      );

      return () => {
        scanner.clear();
      };
    }
  }, [showScanner]);

  useEffect(() => {
    const savedValues = JSON.parse(localStorage.getItem('scannerValue')) || [];
    const totalAmount = savedValues.reduce((sum, item) => sum + item.price, 0);
    const totalItems = savedValues.reduce((sum, item) => sum + item.quantity, 0);

    const netTotal = totalAmount - discount;

    setTotal(netTotal);
    setTotalQuantity(totalItems);
  }, [scannerValue, discount]);

  const handleDelete = (itemName) => {
    const updatedValues = scannerValue.filter(item => item.itemName !== itemName);
    setScannerValue(updatedValues);
  };

  const handleSave = () => {
    const adminData = JSON.parse(localStorage.getItem('admin')) || {};
    adminData.netTotal = (adminData.netTotal || 0) + total;
  
    localStorage.setItem('admin', JSON.stringify(adminData));
  
    localStorage.removeItem('scannerValue');
    setScannerValue([]);
    setDiscount(0);
    setNotification(true);

    setTimeout(() => {
      setNotification(false);
    }, 2000);
  };
  
  const handleCancel = () => {
    localStorage.removeItem('scannerValue');
    setScannerValue([]);
    setDiscount(0);
  };
  

  return (
    <div className={styles.container}>
      {notification && <span className={styles.notification}>Sale successful</span>}
      <div className={styles.topSell}>
        {scannerValue.map((item, index) => (
          <div className={styles.sellCard} key={index}>
            <div>
              <p>عدد الوحدات: {item.quantity}</p>
              <h3>سعر المنتج: {item.price.toLocaleString()}</h3>
            </div>
            <div>
              <span>اسم المنتج: {item.itemName}#</span>
              <h2>نوع المنتج: {item.category}</h2>
              <button onClick={() => handleDelete(item.itemName)}>
                <MdDeleteForever />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.bottomSell}>
        <div className={styles.topPrice}>
          {showScanner && (
            <div className={styles.readerContainer}>
              <div id='reader'></div>
            </div>
          )}
          <button onClick={() => setShowScanner(prev => !prev)}>
            <FaQrcode />
          </button>
          <input 
            type="number" 
            placeholder="discount" 
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className={styles.bottomPrice}>
          <div className={styles.priceDetail}>
            <div className={styles.quantity}>
              <span><FaCartShopping /></span>
              <div>
                <h1>الكميه</h1>
                <p>{totalQuantity}</p>
              </div>
            </div>
            <div className={styles.discount}>
              <span><BiSolidDiscount /></span>
              <div>
                <h1>الخصم</h1>
                <p>{discount.toLocaleString()}</p>
              </div>
            </div>
            <div className={styles.price}>
              <span><MdOutlinePriceChange /></span>
              <div>
                <h1>صافي المبلغ</h1>
                <p>{total.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className={styles.buttons}>
            <button onClick={handleSave}>حفظ</button>
            <button onClick={handleCancel}>الغاء</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
