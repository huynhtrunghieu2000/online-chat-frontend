/**
 *
 * MainLayout
 *
 */
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

interface Props {}

export const MainLayout = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <div>
      {t('')}
      {/*  {t(...messages.someThing())}  */}
    </div>
  );
});
