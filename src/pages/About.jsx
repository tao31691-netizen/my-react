import { useEffect, useState } from "react";
import { usePrevious } from "@/utils/hooks";

export default function About() {
  const [inputVal, setInputVal] = useState(0);
  const prevState = usePrevious(inputVal);

  const str = "12vd-23we-23qw-46ol";
  const fun = (s, n) => {
    let arr = [];
    let arr2 = [];
    for (let k of s) {
      if (k !== "-") {
        arr.push(k.toUpperCase());
      }
    }
    for (let i = 0; i <= arr.length; i++) {
      arr2.push(arr[i]);
      if ((i + 1) % n === 0 && i !== arr.length - 1) {
        arr2.push("-");
      }
    }
    console.log(arr2.join(""));
    return arr2.join("");
  };

  useEffect(() => {
    fun(str, 5);
  }, []);

  useEffect(() => {
    console.log("渲染阶段：当前值", inputVal, "上一次值", prevState);
  }, [inputVal]);

  return (
    <div>
      <h2>About</h2>
      <button onClick={() => setInputVal((prev) => prev + 1)}>+1</button>
      <p>上一次值：{prevState ?? "暂无"}</p>
    </div>
  );
}
