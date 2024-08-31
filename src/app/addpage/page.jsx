"use client";
import { useRef, useState } from "react";
import styles from "./add.module.css";
import { QRCodeCanvas } from "qrcode.react";

const Page = () => {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState(0);
  const [notifction, setNotifction] = useState(false);
  const qrRef = useRef();

  const items = [
    "jeans",
    "Sports T-shirt",
    "Regular T-shirt",
    "shoes",
    "Formal-T-shirt",
    "Jacket",
    "bag",
    "short",
    "Blouse",
    "pajamas",
    "Sports-Equipment",
    "else",
  ];

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setPrice(value);
  };

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${productName}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const saveValue = () => {
    setPrice(0);
    setProductName("");
    setProductType("");
    setNotifction(true);

    setTimeout(() => {
      setNotifction(false);
    }, 2000);
  };

  const qrData = {
    itemName: productName,
    category: productType,
    price: price,
  };

  return (
    <div className={styles.container}>
      {notifction && <span className={styles.notifction}>Item has been cleared</span>}
      <div className={styles.inputs}>
        <input
          type="text"
          placeholder="اسم المنتج"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        >
          {items.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="سعر المنتج"
          value={price}
          onChange={handlePriceChange}
          min="0"
          step="1000"
        />
        <button onClick={saveValue}>Clear</button>
      </div>
      <div className={styles.qrcode} ref={qrRef}>
        {productName && productType && price > 0 && (
          <QRCodeCanvas
            value={JSON.stringify(qrData)}
            onClick={handleDownload}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
