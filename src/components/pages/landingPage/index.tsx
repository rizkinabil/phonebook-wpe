import List from '../../list/List';
import Layout from '../../Layout';
import Button from '../../elements/button/Button';
import { AddIcon } from '../../../assets/icons/AddIcon';
import { theme } from '../../../assets/style/theme';
import { homePageStyle } from './index.style';
import { useState } from 'react';

import AddContact from '../addContact';

const LandingPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Layout>
      <div css={homePageStyle.hero}>Find your beloved one from this PhoneBook</div>
      <div>
        <List />
      </div>
      <div css={homePageStyle.addButtonBottom}>
        <Button
          children={<AddIcon />}
          color={theme.colors.primaryLight}
          radius="50%"
          width="3.275rem"
          height="3.275rem"
          border="solid 1px blue"
          onClick={handleOpen}
        />
        {open && <AddContact onClose={handleClose} />}
      </div>
    </Layout>
  );
};

export default LandingPage;
