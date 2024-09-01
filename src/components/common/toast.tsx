/* eslint-disable @typescript-eslint/no-explicit-any */

const showToast = (
  toast: any,
  title: string,
  status: string,
  description: string
) => {
  toast({
    title: title,
    position: "top-right",
    description,
    status: status,
    duration: 5000,
    // variant: "left-accent",
    isClosable: true,
    containerStyle: {
      fontSize: "12px",
    },
  });
};

export default showToast;
