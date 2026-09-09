import React from 'react';
import ThumAddBtn from '../ThumAddBtn/ThumAddBtn';

function AddThum({ onAddThum }) {
  return <ThumAddBtn onClick={onAddThum} />;
}

export default AddThum;