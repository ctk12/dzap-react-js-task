import { useState } from 'react';
import './App.css'
import { Textarea } from './Textarea'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface duplicatesType {
  [key: string]: string[];
}

function App() {
  const [value, setValue] = useState<string>("");
  const [errors, setErrors] = useState<string[][]>([[]]);
  const [duplicates, setDuplicates] = useState<duplicatesType>({});
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessages] = useState({
    check1: {
      validation: /^0x/g,
      message: "invalid Ethereum address"
    },
    check2: {
      validation: /^\d*$/g,
      message: "wrong amount"
    }
  });

  const handleValue = (value: string) => {
    setValue(value);
    setIsError(false);
  }

  const handleShowExample = () => {
    if (!value) {
      setValue("0x2CB99F193549681e06C6770dDD5543812B4FaFE8=1\n");
    }
  }

  const combine = () => {
    setValue(state => {
      const allValues = state.split("\n");
      const combineArr = [...allValues];
      
      Object.keys(duplicates).map((key: string) => {
        let combineBalance = 0;
        const firstIndex = combineArr.findIndex(data => data.includes(key));
        const firstDataSplit = handleSplitWithSplitBy(combineArr[firstIndex]);
        const splitBy = firstDataSplit[1];
        const splitData = [...firstDataSplit[0]];
        for (let i = 0; i < duplicates[key].length; i++) {
          combineBalance += Number(handleSplit(combineArr[Number(duplicates[key][i])])[1]);
        }
        splitData[1] = String(combineBalance);
        combineArr[firstIndex] = splitData.join(typeof splitBy === "string" ? splitBy : "");
      })
      return combineArr.join("\n");
    });
    keepOne();
  }

  const keepOne = () => {
    setValue(state => {
      let removedArr = state.split("\n");
      let keepOneArr: string[] = [];
     
      Object.keys(duplicates).map((key: string) => {
        keepOneArr = keepOneArr.concat(duplicates[key].slice(1));
      });

      removedArr = removedArr.filter((_data, index) => {
        return !keepOneArr.includes(String(index));
      });

      return removedArr.join("\n");
    });
    setDuplicates({});
    setIsError(false);
  }

  const handleSplit = (data: string) => {
    const strSplit1 = data.split(" ");
    const strSplit2 = data.split(",");
    const strSplit3 = data.split("=");
    return strSplit1.length > 1 ? strSplit1 : strSplit2.length > 1 ? strSplit2 : strSplit3.length > 1 ? strSplit3 : "no";
  }

  const handleSplitWithSplitBy = (data: string) => {
    const strSplit1 = data.split(" ");
    const strSplit2 = data.split(",");
    const strSplit3 = data.split("=");
    return strSplit1.length > 1 ? [strSplit1, " "] : strSplit2.length > 1 ? [strSplit2, ","] : strSplit3.length > 1 ? [strSplit3, "="] : "no";
  }

  const handleSubmit = () => {
    const allValues = value.split("\n");
    allValues.map((data: string, index: number) => {
      if (data !== "") {
        setErrors((state)=> {
          const prevData = [...state];
          const tempArr: string[] = []; 
          const dataSplit = handleSplit(data);
          if ((dataSplit[0].length !== 42 || !data.match(errorMessages.check1.validation)) && !tempArr.includes(errorMessages.check1.message)) {
            tempArr.push(errorMessages.check1.message);
            if (!isError) {
              setIsError(true);
            }
          }

          if ((dataSplit === "no" || ![...dataSplit].reverse()[0].match(errorMessages.check2.validation)) && !tempArr.includes(errorMessages.check2.message)) {
            tempArr.push(errorMessages.check2.message);
            if (!isError) {
              setIsError(true);
            }
          } 
          prevData[index] = tempArr;
          return prevData;
        });

        setDuplicates(state => {
          const prevData = {...state};
          const dataSplit = handleSplit(data)[0];
          const duplicatesIndexes = allValues.map((currentData, index) => {
            const currentSplit = handleSplit(currentData)[0];
            if (dataSplit === currentSplit) {
              return `${index}`;
            }
            return "no";
          }).filter(data => data !== "no");

          if (duplicatesIndexes.length > 1) {
            prevData[dataSplit] = duplicatesIndexes;
            if (!isError) {
              setIsError(true);
            }
          }

          return prevData;
        });
      }
    });
    if (!value) {
      alert("Input is empty");
      setErrors([[]]);
      setDuplicates({});
    }
  }
  
  return (
    <div className="main-app flex justify-center">
      <div className="app-content w-full h-full max-[1024px]:px-2 px-14 py-6">
        <div className="bg-transparent h-max w-full flex flex-col justify-center items-center text-white gap-6 max-w-screen-xl mx-auto">
         <div className="w-full flex flex-col items-center justify-center gap-2">
         <div className="w-full flex justify-between items-center">
            <div>Addresses with Amounts</div>
            <div>Upload File</div>
          </div>
          <div className="app-text rounded-md h-full w-full">
            <Textarea
              name="test-textarea"
              value={value}
              onValueChange={handleValue}
              numOfLines={1}
            />
          </div>
         </div>
         <div className="w-full flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
              <p>Separated by','or''or'='</p>
              <p className="show-example-button" onClick={handleShowExample}>Show Example</p>
          </div>
          {!errors.some(data => data.length !== 0) && Object.keys(duplicates).length !== 0 && (
            <div className="w-full flex justify-between items-center">
                <p>Duplicated</p>
                <p className="duplicated-button"><span onClick={keepOne}>Keep the first one</span><span>|</span><span onClick={combine}>Combine balance</span></p>
            </div>
          )}
         </div>
         {(errors.some(data => data.length !== 0) || Object.keys(duplicates).length !== 0) && (
           <div className="app-error w-full flex items-center p-3 h-max gap-3">
           <div className="w-6 self-start"><InfoOutlinedIcon /></div>
           <div className="flex flex-col">
            {errors.map((data, index) => {
              const line = `Line ${index + 1} ${data.join(" and ")}`; 
              const randomKey = Math.random().toString(36).substring(2,7);
              if (data.length > 0) {
                return (
                  <p key={randomKey}>{line}</p>
                )
              }
            })}

            {!errors.some(data => data.length !== 0) && Object.keys(duplicates).map((key: string) => {
              const randomKey = Math.random().toString(36).substring(2,7);
              return (
                <p key={randomKey}>{`${key} duplicate in Line : ${duplicates[key].map(data => Number(data) + 1).join(", ")}`}</p>
              )
            })}
           </div>
         </div>
         )}
          <div className="w-full flex justify-between items-center">
            <button onClick={handleSubmit} className="app-next-button h-16 w-full rounded-full" disabled={isError}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
