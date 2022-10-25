import { useUser } from "@auth0/nextjs-auth0";
import React, { ReactElement, useEffect, useState } from "react";
import LayoutUser from "../../layouts/layoutUser";
import billApi from "../api/billApi";
import styles from "../../styles/History.module.scss";

function History() {
  const { user } = useUser();
  const [bill, setBill] = useState<any>();
  useEffect(() => {
    const fetchBill = async () => {
      if (user?.sub) {
        const res = await billApi.getBillByUser(user.sub);
        setBill(res);
      }
    };
    fetchBill();
  }, [user]);

  return (
    <>
      <div className={styles.title}>Lịch sử giao dịch</div>
      <table className={styles.table}>
        <tr>
          <th>Mã đơn hàng</th>
          <th>Phương thức thanh toán</th>
          <th>Tên người thanh toán</th>
          <th>Giá tiền</th>
          <th>Ngày giao dịch</th>
        </tr>
        {bill &&
          bill.map((b: any) => {
            return (
              <tr key={b._id}>
                <th>{b._id}</th>
                <th>{b.methodPayment}</th>
                <th>{b.name}</th>
                <th>{b.price}</th>
                <th>{b.updatedAt}</th>
              </tr>
            );
          })}
      </table>
    </>
  );
}

History.getLayout = function getLayout(page: ReactElement) {
  return <LayoutUser>{page}</LayoutUser>;
};

export default History;
