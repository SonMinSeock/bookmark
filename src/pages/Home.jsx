import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "../redux/slice";

const Home = () => {
  const {
    example: { value },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  return (
    <>
      <h1>Home 페이지</h1>
      <div>
        <span>{value}</span>
        <div>
          <button onClick={() => dispatch(increment())}>+1</button>
          <button onClick={() => dispatch(decrement())}>-1</button>
        </div>
      </div>
    </>
  );
};

export default Home;
