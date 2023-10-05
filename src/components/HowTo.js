import React from "react";

function HowTo() {
  return (
    <div className="tutorial">
      <h1>How to use this App</h1>

      <p>
        This application is an order management system that creates shipping
        labels for orders. You'll need to create some things inside of the app
        in order for you to get your shipping label.{" "}
        <u>
          All of the required components are along the Nav bar after you log
          into the application.
        </u>
      </p>
      <p>
        You'll be able to refer back to this page at any time. All that said,
        here's my suggested order:
      </p>
      <p>Step 1: Register for an account</p>
      <p>
        Step 2: go to the Warehouse tab and create a Warehouse. Note that this
        app checks address information against a copy of the USPS Address
        Database, so no dummy data please.
      </p>
      <p>
        Step 3: Create a customer in the Customer tab. Customer information also
        includes a verified address, so please be mindful.
      </p>
      <p>Step 4 (optional): Create one or multiple products for your order.</p>
      <p>
        Step 5: Go to the Orders tab and click CREATE ORDER. You'll be able to
        select your Warehouse, Customer, and optionally Product(s) for the
        order, and then you'll be able to configure some shipment details.
        Finally, click "Create Label", and your label download will be available
        in the Shipments tab.
      </p>
      <p>
        Note: this version of the application is a "minimum viable product," and
        does not reflect the full scope and scale of the functionalities I
        intend for it to support... yet.
      </p>
    </div>
  );
}

export default HowTo;
