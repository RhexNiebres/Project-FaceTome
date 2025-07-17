import React, { useState } from 'react';
import CreatePost from './CreatePost';
import AiPostGenerator from './AiPostGenerator';

const TabsToggle = ({onPostCreated}) => {
  const [activeTab, setActiveTab] = useState('manual');

  return (
    <div>
      <div>
        <button onClick={() => setActiveTab('manual')}>Tab 1</button>
        <button onClick={() => setActiveTab('AI')}>Tab 2</button>
      </div>

      <div>
        {activeTab === 'manual' ? <CreatePost onPostCreated={onPostCreated} /> : <AiPostGenerator onPostCreated={onPostCreated}/>}
      </div>
    </div>
  );
};

export default TabsToggle;
