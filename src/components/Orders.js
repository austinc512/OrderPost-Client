import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
// import { useNavigate } from "react-router-dom";

const host = process.env.REACT_APP_URL;

function Orders() {
  const { token } = useAuth();
  console.log(`looking for token on orders page`);
  console.log(token);
  const [orders, setOrders] = useState([]);
  //   const navigate = useNavigate();
  useEffect(() => {
    if (token.length) {
      console.log(`in Orders useEffect hook if(props.length), ${token}`);
      axios
        .get(`${host}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOrders(res.data.data);
          // ^^ this is super fucking annoying
          // I don't have time to change my API design for this right now
        });
    }
  }, [token]);

  return (
    <div>
      <ul className="list">
        {!orders.length ? (
          <p>Loading...</p>
        ) : (
          orders.map((item) => {
            console.log(item);
            return (
              <li className="item" key={item.order_id}>
                {item.order_number}: {item.order_status}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default Orders;
