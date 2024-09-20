import React from 'react';
import { POD, AddItemBtn, SearchBar, NightMeals, Latest, QuickRec, Tasty } from "../components/index";
import InstallPrompt from '../components/Install';


function Home() {
  return (
    <div>
      <InstallPrompt/>
      <SearchBar />
      <POD />
      <NightMeals />
      <Latest />
      <QuickRec />
      <Tasty />
      <AddItemBtn />
    </div>
  );
}

export default Home;
