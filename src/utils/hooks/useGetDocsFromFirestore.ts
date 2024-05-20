import { useEffect, useState } from "react";

// firebase
import { db } from "../../main";
import { collection, getDocs, DocumentData } from "firebase/firestore";

interface Props {
  path: string;
}

interface ReturnProps {
  isLoading: boolean;
  error: string;
  data: DocumentData[] | null;
}

const UseGetDocsFromFirestore = ({ path }: Props): ReturnProps => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<DocumentData[] | null>(null);

  const fetchDataFromFirebase = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(collection(db, path));
      const allDocs = querySnapshot.docs.map((doc) => doc.data());
      setData(allDocs);
    } catch (error) {
      console.log(error);
      setError("There was an error");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataFromFirebase();
  }, []);

  return { isLoading, error, data };
};

export default UseGetDocsFromFirestore;
