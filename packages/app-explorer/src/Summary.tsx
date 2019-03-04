// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { CardSummary } from '@polkadot/ui-app/index';
import { BestFinalised, BestNumber, TimeNow, TimePeriod } from '@polkadot/ui-reactive/index';

import SummarySession from './SummarySession';
import translate from './translate';

import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

type Props = I18nProps & {};

class Summary extends React.PureComponent<Props> {

  render () {
    const { className, style, t } = this.props;

    return (
        <div
          className={`summary summary--fullWidth isSummary  ${className}`}
          style={style}
        >
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={1}
            totalSlides={2}
            className='summary--Carousel'
          >
            <Slider>
              <Slide className='summary--Carousel-slide' index={0}>
                <div className='isSummary'>
                  <section>
                    <CardSummary label={t('target')}>
                      <TimePeriod />
                    </CardSummary>
                    <CardSummary label={t('last block')}>
                      <TimeNow />
                    </CardSummary>
                  </section>
                  <section>
                    <SummarySession />
                  </section>
                  <section>
                    <CardSummary label={t('finalised')}>
                      <BestFinalised />
                    </CardSummary>
                    <CardSummary label={t('best')}>
                      <BestNumber />
                    </CardSummary>
                  </section>
                </div>
              </Slide>
              <Slide className='summary--Carousel-slide' index={1}>
                <div className='isSummary'>
                  <section>
                    <article>
                      More Stats Here
                    </article>
                  </section>
                </div>
              </Slide>

            </Slider>
            <DotGroup />
          </CarouselProvider>
        </div>
    );
  }
}

export default translate(Summary);
