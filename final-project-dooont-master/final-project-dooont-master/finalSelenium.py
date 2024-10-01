import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def navigateToRegister():
  try:
    time.sleep(2)
    button = WebDriverWait(driver, 100).until(
          EC.element_to_be_clickable((By.XPATH, "//button[text()='Register']"))
      )
    button.click()
    time.sleep(2)
    print("Navigation to Register successful!")
  except:
    print("Button not found")
  finally:
    print("navigateToRegister test concluded")
    navigateHome()


def navigateHome():
  try:
    time.sleep(2)
    button = WebDriverWait(driver, 100).until(
          EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Home')]"))
      )
    button.click()
    time.sleep(2)
    print("Navigation to Home successful!")
  except:
    print("Button not found")
  finally:
    print("navigateHome test concluded")

def navigateLogin():
  try:
    time.sleep(2)
    button = WebDriverWait(driver, 100).until(
          EC.element_to_be_clickable((By.XPATH, "//button[text()='Login']"))
      )
    button.click()
    time.sleep(2)
    print("Navigation to Login successful!")
  except:
    print("Button not found")
  finally:
    print("navigateLogin test concluded")
    loginTest()

def loginTest():
  try:
    time.sleep(2)
    input_username = driver.find_element(By.ID, 'username')
    input_username.send_keys('johnsmith')
    print("username inputted successfully")
    try:
      time.sleep(2)
      input_password = driver.find_element(By.ID, 'password')
      input_password.send_keys('12345678')
      print("password inputted successfully")
      try:
        time.sleep(2)
        submit_button = driver.find_element(By.CSS_SELECTOR, 'input[type="submit"]')
        submit_button.click()
        print("button clicked successfully")
      except:
        print("submit button not found")
    except:
      print("password input form not found")
  except:
    print("username input form not found")
  finally:
    print("login test concluded!")

def main():
  navigateToRegister()
  #navigateHome test nested in navigateToRegister
  navigateLogin()
  #login test nested in navigateLogin

# Set up Chrome options
chrome_options = Options()
chrome_driver_path = "C:\\Users\\Matthew Maung\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe"
service = Service(executable_path=chrome_driver_path)

# Initialize the driver
driver = webdriver.Chrome(service=service, options=chrome_options)
driver.get("http://localhost:3000/")
main()
time.sleep(20)
driver.quit()






