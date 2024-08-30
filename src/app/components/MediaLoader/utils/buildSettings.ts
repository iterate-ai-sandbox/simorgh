import onClient from '#app/lib/utilities/onClient';
import getEmbedURL from '../../../lib/utilities/getUrlHelpers/getEmbedUrl';
import { BuildConfigProps, PlayerConfig } from '../types';
import configForMediaBlockType from '../configs';

const isTestRequested = () => {
  if (onClient()) {
    const testLiterals = window.location.hostname.match(/localhost|test/g);
    const isTest = testLiterals && testLiterals.length > 0;

    const queryParams = new URLSearchParams(window.location.search);
    const isRenderEnvLive = queryParams.get('renderer_env') === 'live';

    return isTest && !isRenderEnvLive;
  }

  return false;
};

const buildSettings = ({
  blocks,
  counterName,
  statsDestination,
  producer,
  isAmp,
  lang,
  pageType,
  service,
  translations,
  adsEnabled = false,
  showAdsBasedOnLocation = false,
  embedded,
  pathname,
}: BuildConfigProps) => {
  // To do - check whether this should be conditional
  const embedUrl = pathname
    ? getEmbedURL({
        type: 'avEmbed',
        mediaId: pathname,
        queryString: '',
      })
    : '';
  // Base configuration that all media players should have
  const basePlayerConfig: PlayerConfig = {
    autoplay: true,
    product: 'news',
    enableToucan: true,
    appType: isAmp ? 'amp' : 'responsive',
    appName: service !== 'news' ? `news-${service}` : 'news',
    ui: {
      controls: { enabled: true },
      locale: { lang: lang || 'en' },
      subtitles: { enabled: true, defaultOn: true },
      fullscreen: { enabled: true },
    },
    ...(counterName && { counterName }),
    ...(isTestRequested() && { mediator: { host: 'open.test.bbc.co.uk' } }),
    ...(embedded && {
      externalEmbedUrl: embedUrl,
    }),
    statsObject: {
      destination: statsDestination,
      producer,
    },
  };

  // Augment base configuration with settings that are specific to the media type
  const config = configForMediaBlockType(blocks)?.({
    basePlayerConfig,
    blocks,
    pageType,
    translations,
    adsEnabled,
    showAdsBasedOnLocation,
    embedded,
  });

  if (!config) return null;

  return config;
};

export default buildSettings;
