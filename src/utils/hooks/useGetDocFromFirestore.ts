import { useEffect, useState } from "react";

// firebase
import { db } from "../../main";
import { doc, getDoc, DocumentData } from "firebase/firestore";

interface Props {
  path: string;
  docId: string;
}

interface ReturnProps {
  isLoading: boolean;
  error: string;
  data: DocumentData | null;
}

const UseGetDocsFromFirestore = ({ path, docId }: Props): ReturnProps => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<DocumentData | null>(null);

  const fetchDataFromFirebase = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const docRef = doc(db, path, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      }
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
