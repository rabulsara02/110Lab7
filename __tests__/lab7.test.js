describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO. 
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
      });
    });

    console.log(`Checking product item 1/${prodItemsData.length}`);

    // Make sure the title, price, and image are populated in the JSON
    
    firstValue = prodItemsData[0];
    for(let i=0; i < prodItemsData.length; i++){
      console.log(`Checking product item ${i+1}/ ${prodItemsData.length}`);
      let data = prodItemsData[i]
      if (data.title.length == 0) { allArePopulated = false; }
      if (data.price.length == 0) { allArePopulated = false; }
      if (data.image.length == 0) { allArePopulated = false; }
    }
      
    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

    /**
    **** TODO - STEP 1 ****
    * Right now this function is only checking the first <product-item> it found, make it so that
      it checks every <product-item> it found
    * Remove the .skip from this it once you are finished writing this test.
    */

  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    /**
     **** TODO - STEP 2 **** 
     * Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
     * Grab the shadowRoot of that element (it's a property), then query a button from that shadowRoot.
     * Once you have the button, you can click it and check the innerText property of the button.
     * Once you have the innerText property, use innerText.jsonValue() to get the text value of it
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

    // get the first product
    const productItem = await page.$('product-item');

    // accesss its shadowRoot
    const shadowRoot = await productItem.getProperty('shadowRoot');

    // from shadowRoot, query the button
    const buttonHandle = await shadowRoot.$('button');

    // click button
    await buttonHandle.click()

    // get the text of the button
    const innerTextProp = await buttonHandle.getProperty('innerText');
    const buttonText = await innerTextProp.jsonValue();

    // check if its changed
    expect(buttonText).toBe('Remove from Cart');

  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    const productItems = await page.$$('product-item');
    console.log(`Found ${productItems.length} product items`);
  
    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonTextProp = await button.getProperty('innerText');
      const buttonText = await buttonTextProp.jsonValue();
  
      console.log(`Item ${i + 1}: button text is "${buttonText}"`);
  
      if (buttonText !== 'Remove from Cart') {
        await button.click();
        console.log(`→ Clicked item ${i + 1}`);
      }
    }
  
    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    console.log(`Final cart count is: ${cartCount}`);
    expect(cartCount).toBe('20');

    /**
     **** TODO - STEP 3 **** 
     * Query select all of the <product-item> elements, then for every single product element
       get the shadowRoot and query select the button inside, and click on it.
     * Check to see if the innerText of #cart-count is 20
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  }, 20000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    /**
     **** TODO - STEP 4 **** 
     * Reload the page, then select all of the <product-item> elements, and check every
       element to make sure that all of their buttons say "Remove from Cart".
     * Also check to make sure that #cart-count is still 20
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

      //  reload
    await page.reload();

    await page.waitForSelector('product-item');

    const productItems = await page.$$('product-item');

    let allButtonsCorrect = true;

    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonTextProp = await button.getProperty('innerText');
      const buttonText = await buttonTextProp.jsonValue();

      console.log(`Item ${i + 1}: button text is "${buttonText}"`);

      if (buttonText !== 'Remove from Cart') {
        allButtonsCorrect = false;
      }
    }

    // make sure cart count is 20
    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(allButtonsCorrect).toBe(true);
    expect(cartCount).toBe('20');

  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {

    /**
     **** TODO - STEP 5 **** 
     * At this point the item 'cart' in localStorage should be 
       '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', check to make sure it is
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

    const cartData = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    console.log(`Cart data in localStorage: ${cartData}`);
    expect(cartData).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');  

  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    /**
     **** TODO - STEP 6 **** 
     * Go through and click "Remove from Cart" on every single <product-item>, just like above.
     * Once you have, check to make sure that #cart-count is now 0
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
    const productItems = await page.$$('product-item');

    for(let i = 0; i < productItems.length; i++){
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonTextProperty = await button.getProperty('innerText');
      const buttonText = await buttonTextProperty.jsonValue();

      console.log(`Items ${i+1}: button text is "${buttonText}"`);

      if(buttonText === 'Remove from Cart'){
        await button.click();
        console.log(`-> Clicked to remove item ${i+1}`);
      }
    }

    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    console.log(`Final cart count is: ${cartCount}`);
    expect(cartCount).toBe('0');

  }, 20000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    /**
     **** TODO - STEP 7 **** 
     * Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
       is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
     * Also check to make sure that #cart-count is still 0
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
    await page.reload();
    await page.waitForSelector('product-item');

    const productItems = await page.$$('product-item');

    let allButtonsCorrect = true;

    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonTextProp = await button.getProperty('innerText');
      const buttonText = await buttonTextProp.jsonValue();

      console.log(`Item ${i + 1}: button text is "${buttonText}"`);

      if (buttonText !== 'Add to Cart') {
        allButtonsCorrect = false;
      }
    }

    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(allButtonsCorrect).toBe(true);
    expect(cartCount).toBe('0');


  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    /**
     **** TODO - STEP 8 **** 
     * At this point he item 'cart' in localStorage should be '[]', check to make sure it is
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
     const cartData = await page.evaluate(() => {
        return localStorage.getItem('cart');
      });
  
    console.log(`Cart data in localStorage: ${cartData}`);
    expect(cartData).toBe('[]');

  });
});
