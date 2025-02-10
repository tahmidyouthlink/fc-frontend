export default function getUserStatusInfo(userScore) {
  // Standard: 0 - 99
  if (!userScore || userScore < 100)
    return {
      title: "Standard",
      imgColor: "#848484",
      borderColor: "#e5e5e5",
      textColor: "#525252",
      backgroundColor: "#f5f5f5",
    };

  // Premium: 100 - 999
  if (userScore < 1000)
    return {
      title: "Premium",
      imgColor: "#56d471",
      borderColor: "#dff4db",
      textColor: "#5db851",
      backgroundColor: "#ecfee9",
    };

  // Bronze: 1,000 - 4,999
  if (userScore < 5000)
    return {
      title: "Bronze",
      imgColor: "#cd7f32",
      borderColor: "#f7e4d2",
      textColor: "#cd7f32",
      backgroundColor: "#ffefe0",
    };

  // Silver: 5,000 - 9,999
  if (userScore < 10000)
    return {
      title: "Silver",
      imgColor: "#bcbcbc",
      borderColor: "#efefef",
      textColor: "#6e6e6e",
      backgroundColor: "#f4f4f4",
    };

  // Gold: 10,000+
  return {
    title: "Gold",
    imgColor: "#d4af37",
    borderColor: "#f4edd8",
    textColor: "#d4af37",
    backgroundColor: "#fff9e4",
  };
}
