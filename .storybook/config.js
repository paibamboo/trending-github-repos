import {addDecorator, configure} from '@storybook/react';
import {withMockedTranslation} from "@crazyfactory/storybook-props-mock-addon/lib/withMockedTranslation";
addDecorator(withMockedTranslation());
configure(require.context('../src', true, /\.stories\.tsx$/), module);
