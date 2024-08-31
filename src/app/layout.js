import './globals.css'
import Link from 'next/link'
import { MdSell } from "react-icons/md";
import { BiBarcodeReader } from "react-icons/bi";
import { TbZoomMoney } from "react-icons/tb";


export const metadata = {
  title: 'Cashier_App',
  description: 'Cashier_App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <div className='app'>
        <nav className="nav">
            <div className="link">
              <span><MdSell/></span>
              <Link href="/sellpage"> البيع</Link>
            </div>
            <div className="link">
              <span><BiBarcodeReader/></span>
              <Link href="/addpage"> الاضافه</Link>
            </div>
            <div className="link">
              <span><TbZoomMoney/></span>
              <Link href="/debit"> الدين</Link>
            </div>
        </nav>
      {children}
    </div>
      </body>
    </html>
  )
}
