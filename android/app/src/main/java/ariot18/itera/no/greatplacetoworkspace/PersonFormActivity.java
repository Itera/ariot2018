package ariot18.itera.no.greatplacetoworkspace;

import android.content.Intent;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import org.json.JSONException;

public class PersonFormActivity extends AppCompatActivity {

    TextView header;
    EditText nameField;
    EditText sittingHeightField;
    EditText standingHeightField;
    EditText tempPreferencesField;
    String cardId;
    String sanityId;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_person_form);
        Intent intent = getIntent();
        Person person = intent.getParcelableExtra(RegistrationFormActivity.SANITY_RESPONSE);
        cardId = person.getId();
        sanityId = person.getSanityId();


        header = findViewById(R.id.greeter);
        nameField = findViewById(R.id.nameField);
        sittingHeightField = findViewById(R.id.sittingHeightField);
        standingHeightField = findViewById(R.id.standingHeightField);
        tempPreferencesField = findViewById(R.id.tempPreferencesField);

        header.setText(getString(R.string.initial_top_person_form, person.getId()));
        nameField.setText(person.getName());
        sittingHeightField.setText(person.getPreferredSittingHeight());
        standingHeightField.setText(person.getPreferredStandingHeight());
        tempPreferencesField.setText(person.getTempPreferences());
    }

    public void submit(View view) {
        Person p = new Person();
        p.setId(cardId);
        p.setSanityId(sanityId);
        p.setName(nameField.getText().toString());
        p.setTempPreferences(tempPreferencesField.getText().toString());
        p.setPreferredSittingHeight(sittingHeightField.getText().toString());
        p.setPreferredStandingHeight(standingHeightField.getText().toString());
        System.out.println("submittin");
        new SanityClient(this).createOrReplacePerson(p, json -> {
            try {
                sanityId = json.getJSONArray("results").getJSONObject(0).getJSONObject("document").getString("_id");
            } catch (JSONException e) {
                e.printStackTrace();
            }
            Snackbar mySnackbar = Snackbar.make(view, R.string.success_snackbar, Snackbar.LENGTH_SHORT);
            mySnackbar.show();
            System.out.println(json);
        }, error -> System.out.println(error.toString()));
    }
}
