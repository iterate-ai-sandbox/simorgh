import React, { useContext } from 'react';
import { bool, string, number, oneOfType } from 'prop-types';
import moment from 'moment';
import path from 'ramda/src/path';
import VisuallyHiddenText from '#psammead/psammead-visually-hidden-text/src';
import formatDuration from '#app/lib/utilities/formatDuration';
import Promo from '#components/Promo';
import { ServiceContext } from '../../../../contexts/ServiceContext';

const CurationPromo = ({
  id,
  title,
  firstPublished,
  imageUrl,
  imageAlt,
  lazy,
  link,
  type,
  duration: mediaDuration,
  headingLevel,
}) => {
  const { translations } = useContext(ServiceContext);

  const audioTranslation = path(['media', 'audio'], translations);
  const videoTranslation = path(['media', 'video'], translations);
  const photoGalleryTranslation = path(['media', 'photogallery'], translations);
  const durationTranslation = path(['media', 'duration'], translations);
  const duration = moment.duration(mediaDuration, 'seconds');
  const separator = ',';

  const formattedDuration = formatDuration({ duration, separator });
  const durationString = `${durationTranslation}, ${formattedDuration}`;

  return (
    <Promo>
      <Promo.Image src={imageUrl} alt={imageAlt} lazyLoad={lazy}>
        <Promo.MediaIcon type={type}>
          {type === 'audio' || type === 'video' ? mediaDuration : ''}
        </Promo.MediaIcon>
      </Promo.Image>
      <Promo.Heading as={`h${headingLevel}`}>
        {type !== 'article' ? (
          <Promo.A href={link} aria-labelledby={id}>
            <span id={id} role="text">
              <VisuallyHiddenText>
                {(type === 'audio' && `${audioTranslation}, `) ||
                  (type === 'video' && `${videoTranslation}, `) ||
                  (type === 'photogallery' && `${photoGalleryTranslation}, `)}
              </VisuallyHiddenText>
              {title}
              {type !== 'photogallery' && mediaDuration && (
                <VisuallyHiddenText>{durationString}</VisuallyHiddenText>
              )}
            </span>
          </Promo.A>
        ) : (
          <Promo.A href={link}>{title}</Promo.A>
        )}
      </Promo.Heading>
      <Promo.Timestamp>{firstPublished}</Promo.Timestamp>
    </Promo>
  );
};

CurationPromo.propTypes = {
  id: string.isRequired,
  title: string.isRequired,
  // epoch time or ISO8601 timestamp
  firstPublished: oneOfType([number, string]).isRequired,
  imageUrl: string.isRequired,
  imageAlt: string.isRequired,
  lazy: bool,
  link: string.isRequired,
  type: string,
  duration: number,
  headingLevel: number,
};

CurationPromo.defaultProps = {
  lazy: false,
  type: null,
  duration: null,
  headingLevel: 2,
};

export default CurationPromo;
