import './App.css'
import AppLayout from './components/layout/AppLayout'
import PageHeader from './components/layout/PageHeader'
import CategoryTabs from './components/converter/CategoryTabs'
import ConverterField from './components/converter/ConverterField'
import SwapButton from './components/converter/SwapButton'
import ConvertButton from './components/converter/ConvertButton'
import RateInfoCard from './components/converter/RateInfoCard'
import HistorySection from './components/history/HistorySection'
import ConfirmModal from './components/modal/ConfirmModal'
import { useConverterApp } from './hooks'
import { formatNumber } from './utils'

function App() {
  const app = useConverterApp()

  return (
    <>
      <AppLayout
        header={
          <PageHeader
            title="All Unit Converter"
            subtitle="Quick converter for currency, length, weight, temperature, and time."
            statusMessage={app.statusMessage}
          />
        }
        footer={
          <p className="app-footer-note">
            Rates refresh on demand and recent conversions stay available in local history.
          </p>
        }
      >
        <section className="converter-panel" aria-label="Unit converter">
          <CategoryTabs
            categories={app.categories}
            activeCategoryId={app.category}
            onChange={app.setCategory}
          />

          <div className="converter-grid">
            <ConverterField
              id="converter-input"
              label="From"
              value={app.amount}
              unitId={app.fromUnitId}
              units={app.availableUnits}
              onValueChange={app.setAmount}
              onUnitChange={app.setFromUnit}
              inputMode="decimal"
            />

            <div className="converter-actions" aria-label="Conversion controls">
              <SwapButton onClick={app.swapUnits} />
              <ConvertButton disabled={!app.canConvert} onClick={app.submitConversion} />
            </div>

            <ConverterField
              id="converter-output"
              label="To"
              value={
                app.previewResult ? formatNumber(app.previewResult.output, 'cs-CZ', 6) : ''
              }
              unitId={app.toUnitId}
              units={app.availableUnits}
              onUnitChange={app.setToUnit}
              readOnly
            />
          </div>

          {app.rateInfo.visible ? (
            <RateInfoCard rateInfo={app.rateInfo} onRefresh={app.refreshRates} />
          ) : null}
        </section>

        <HistorySection
          history={app.history}
          onApplyItem={app.applyHistoryItem}
          onDeleteItem={app.deleteHistoryItem}
          onClearAll={app.openClearHistoryModal}
        />
      </AppLayout>

      <ConfirmModal
        open={app.isClearHistoryModalOpen}
        title="Clear history?"
        description="This removes all saved conversions from local history."
        confirmLabel="Clear"
        cancelLabel="Cancel"
        onConfirm={app.clearHistory}
        onCancel={app.closeClearHistoryModal}
      />
    </>
  )
}

export default App
