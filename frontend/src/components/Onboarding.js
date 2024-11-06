import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    aboutMe: "",
    address: {},
    birthdate: "",
  });
  const [pageConfig, setPageConfig] = useState({});

  useEffect(() => {
    const fetchPageConfig = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getPageConfig");
        const data = await response.json();
        setPageConfig(data);
        // console.log("data", data);
      } catch (error) {
        console.error("Error fetching page configuration:", error);
      }
    };

    fetchPageConfig();
  }, [step]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const url = `http://localhost:5000/api/getUserProgress?email=${encodeURIComponent(
          userData.email
        )}`;
        // console.log("Fetching progress from URL:", url); 
        const response = await fetch(url);
        const data = await response.json();
        if (data.message !== "No progress found for this user") {
        //   console.log("UE", data);
          setUserData(data.userData);
          setStep(data.step);
        } else {
            await saveProgress(step);
            // console.log("DATA1",data)
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    if (step === 2) {
      fetchProgress();
    }

    if(step === 3) {
    saveProgress(step);
    }
  }, [step]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      
    }
  };

  const saveProgress = async (currentStep) => {
    try {
      await fetch("http://localhost:5000/api/saveUserProgress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: currentStep, userData }),
      });
    } catch (error) {
      console.error("Error saving user progress:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    setUserData({
      email: "",
      password: "",
      aboutMe: "",
      address: {},
      birthdate: "",
    });
    setStep(1);
  };

  return (
    <div>
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        Onboarding Flow - Step {step}
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "90%",
          marginLeft: "5%",
        }}
      >
        {step === 1 && (
          <>
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              required
              style={{ margin: "1%" }}
              color={userData.email === "" ? "warning" : "success"}
              focused
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              required
              style={{ margin: "1%" }}
              color={userData.password === "" ? "warning" : "success"}
              focused
         
            />
          </>
        )}
        {step === 2 && pageConfig.page2 && (
          <>
            {pageConfig.page2.includes("aboutMe") && (
              <TextField
                multiline
                name="aboutMe"
                placeholder="About Me"
                value={userData.aboutMe}
                onChange={handleChange}
                style={{ margin: "1%" }}
              />
            )}
            {pageConfig.page2.includes("birthdate") && (
              <TextField
                name="birthdate"
                type="date"
                value={userData.birthdate}
                onChange={handleChange}
                style={{ margin: "1%" }}
              />
            )}
          </>
        )}
        {step === 3 && pageConfig.page3 && (
          <>
            {pageConfig.page3.includes("address") && (
              <>
                <TextField
                  name="address"
                  placeholder="Street Address"
                  value={userData.address.street}
                  onChange={handleChange}
                  style={{ margin: "1%" }}
                />
                <TextField
                  name="city"
                  placeholder="City"
                  value={userData.address.city}
                  onChange={handleChange}
                  style={{ margin: "1%" }}
                />
                <TextField
                  name="state"
                  placeholder="State"
                  value={userData.address.state}
                  onChange={handleChange}
                  style={{ margin: "1%" }}
                />
                <TextField
                  name="zip"
                  placeholder="ZIP"
                  value={userData.address.zip}
                  onChange={handleChange}
                  style={{ margin: "1%" }}
                />
              </>
            )}
          </>
        )}
        {step !== 3 && (
          <Button
          disabled={userData.email === "" || userData.password === ""}
            variant="contained"
            type="button"
            onClick={handleNext}
            style={{ margin: "1%", width: "50%", marginLeft: "25%" }}
          >
            Next
          </Button>
        )}
        {step === 3 && (
          <Button
            variant="contained"
            type="submit"
            style={{ margin: "1%", width: "50%", marginLeft: "25%" }}
          >
            Submit
          </Button>
        )}
      </form>
    </div>
  );
};

export default Onboarding;
