import { loadTelemetryScript } from ':core/telemetry/initCCA.js';
import { getFavicon } from ':core/type/util.js';
import { store } from ':store/store.js';
import { checkCrossOriginOpenerPolicy } from ':util/checkCrossOriginOpenerPolicy.js';
import { getCoinbaseInjectedProvider } from ':util/provider.js';
import { validatePreferences } from ':util/validatePreferences.js';
import { CoinbaseWalletProvider } from './CoinbaseWalletProvider.js';
import { LogoType, walletLogo } from './assets/wallet-logo.js';
import { AppMetadata, Preference, ProviderInterface } from './core/provider/interface.js';

// for backwards compatibility
type CoinbaseWalletSDKOptions = Partial<AppMetadata>;

/**
 * CoinbaseWalletSDK
 *
 * @deprecated CoinbaseWalletSDK is deprecated and will likely be removed in a future major version release.
 * It's recommended to use `createCoinbaseWalletSDK` instead.
 */
export class CoinbaseWalletSDK {
  private metadata: AppMetadata;

  constructor(metadata: Readonly<CoinbaseWalletSDKOptions>) {
    void store.persist.rehydrate();

    this.metadata = {
      appName: metadata.appName || 'Dapp',
      appLogoUrl: metadata.appLogoUrl || getFavicon(),
      appChainIds: metadata.appChainIds || [],
    };

    store.config.set({
      metadata: this.metadata,
    });

    void checkCrossOriginOpenerPolicy();
  }

  public makeWeb3Provider(
    preference: Preference = {
      options: 'all',
    }
  ): ProviderInterface {
    validatePreferences(preference);
    if (preference.telemetry !== false) {
      void loadTelemetryScript();
    }
    store.config.set({
      preference,
    });
    const params = { metadata: this.metadata, preference };
    return getCoinbaseInjectedProvider(params) ?? new CoinbaseWalletProvider(params);
  }

  /**
   * Official Coinbase Wallet logo for developers to use on their frontend
   * @param type Type of wallet logo: "standard" | "circle" | "text" | "textWithLogo" | "textLight" | "textWithLogoLight"
   * @param width Width of the logo (Optional)
   * @returns SVG Data URI
   */
  public getCoinbaseWalletLogo(type: LogoType, width = 240): string {
    return walletLogo(type, width);
  }
}
