/** @jsx jsx */
import { useContext, forwardRef } from 'react';
import { jsx } from '@emotion/react';
import useViewTracker from '#app/hooks/useViewTracker';
import { EventTrackingMetadata } from '#app/models/types/eventTracking';
import idSanitiser from '#app/lib/utilities/idSanitiser';
import Paragraph from '../Paragraph';
import Heading from '../Heading';
import Image from '../Image';
import { LeftChevron, RightChevron } from '../icons';
import { ServiceContext } from '../../contexts/ServiceContext';
import CallToActionLink from '../CallToActionLink';
import styles from './index.styles';

interface BillboardProps {
  heading: string;
  description?: string;
  link?: string;
  linkText: string;
  image?: string;
  eventTrackingData?: EventTrackingMetadata;
}

const Banner = forwardRef(
  (
    {
      heading,
      description,
      link,
      linkText,
      image,
      eventTrackingData,
    }: BillboardProps,
    viewRef,
  ) => {
    const { dir } = useContext(ServiceContext);
    const isRtl = dir === 'rtl';

    const id = `billboard-${idSanitiser(heading)}`;

    return (
      <section
        css={styles.container}
        role="region"
        aria-labelledby={id}
        data-testid={id}
      >
        <div ref={viewRef} css={styles.card}>
          <div css={styles.textWrap}>
            <Heading level={2} size="paragon" css={styles.heading} id={id}>
              {heading}
            </Heading>
            <Paragraph size="longPrimer" css={styles.paragraph}>
              {description}
            </Paragraph>
          </div>
          <div css={styles.flex}>
            <CallToActionLink
              href={link}
              css={styles.callToActionLink}
              className="focusIndicatorInvert"
              eventTrackingData={eventTrackingData}
            >
              {linkText}
              {isRtl ? (
                <LeftChevron css={styles.chevron} />
              ) : (
                <RightChevron css={styles.chevron} />
              )}
            </CallToActionLink>
            {image && (
              <div css={isRtl ? styles.imageRtl : styles.imageLtr}>
                <Image
                  alt=""
                  src={image.replace('{width}', 'raw')}
                  placeholder={false}
                  aspectRatio={[16, 9]}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  },
);

const Billboard = ({
  heading,
  description,
  link,
  linkText,
  image,
  eventTrackingData,
}: BillboardProps) => {
  const viewRef = useViewTracker(eventTrackingData);

  return (
    <Banner
      heading={heading}
      linkText={linkText}
      description={description}
      link={link}
      image={image}
      eventTrackingData={eventTrackingData}
      ref={viewRef}
    />
  );
};

export default Billboard;
