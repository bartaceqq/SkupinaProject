import './App.css'
import { AppLayout, PageHeader } from './components/layout'
import {
  CategoryTabs,
  ConvertButton,
  ConverterField,
  RateInfoCard,
  SwapButton,
} from './components/converter'
import { HistorySection } from './components/history'
import StatusMessage from './components/feedback/StatusMessage'
import ConfirmModal from './components/modal/ConfirmModal'
import { useConverterApp } from './hooks'

function App() {
  const app = useConverterApp()

  return (
    <>
      <AppLayout>
        <section className="wireframe-card" aria-label="All Unit Converter">
          <PageHeader
            kicker="Offline-ready converter"
            title="All Unit Converter"
            subtitle="Měna, délka, váha, teplota a čas v jednom přehledném převodníku."
          />

          <div className="wireframe-card__body">
            <CategoryTabs
              categories={app.categories}
              activeCategoryId={app.category}
              onChange={app.setCategory}
              panelId="converter-panel"
            />

            <section
              id="converter-panel"
              className="converter-panel"
              aria-labelledby="converter-section-title"
            >
              <div className="converter-panel__labels">
                <span id="converter-section-title">Z:</span>
                <span className="converter-panel__spacer" aria-hidden="true" />
                <span className="converter-panel__target-label">Do:</span>
              </div>

              <div className="converter-grid">
                <ConverterField
                  label="Z:"
                  value={app.amount}
                  units={app.availableUnits}
                  selectedUnitId={app.fromUnitId}
                  onValueChange={app.setAmount}
                  onUnitChange={app.setFromUnit}
                  helperText={app.amountMessage}
                  isInvalid={app.isAmountInvalid}
                />

                <div className="swap-row">
                  <SwapButton onClick={app.swapUnits} />
                </div>

                <ConverterField
                  label="Do:"
                  value={app.previewResult?.output ?? ''}
                  units={app.availableUnits}
                  selectedUnitId={app.toUnitId}
                  onUnitChange={app.setToUnit}
                  ariaLive="polite"
                  readOnly
                />
              </div>

              <div className="converter-panel__actions">
                <ConvertButton disabled={!app.canConvert} onClick={app.submitConversion} />
              </div>
            </section>

            <HistorySection
              history={app.history}
              onApplyItem={app.applyHistoryItem}
              onClearAll={app.openClearHistoryModal}
            />

            <RateInfoCard
              visible={app.rateInfo.visible}
              loading={app.rateInfo.loading}
              error={app.rateInfo.error}
              rateText={app.rateInfo.rateText}
              effectiveDate={app.rateInfo.effectiveDate}
              lastUpdated={app.rateInfo.lastUpdated}
              source={app.rateInfo.source}
              onRefresh={app.refreshRates}
            />
          </div>
        </section>

        <div className="status-strip">
          <StatusMessage tone={app.statusMessage?.tone} text={app.statusMessage?.text} compact />
        </div>
      </AppLayout>

      <ConfirmModal
        open={app.isClearHistoryModalOpen}
        title="Vymazat historii?"
        description="Akce odstraní všechny uložené převody z historie aplikace."
        confirmLabel="Potvrdit"
        cancelLabel="Zrušit"
        onConfirm={app.clearHistory}
        onCancel={app.closeClearHistoryModal}
      />
    </>
  )
}

export default App
